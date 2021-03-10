/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */

import * as _ from "lodash";
import { VerboseDate } from "../common-models/month-info.model";
import { MonthDataModel, ScheduleDataModel } from "../common-models/schedule-data.model";
import { ShiftCode, SHIFTS } from "../common-models/shift-info.model";
import { isAllValuesDefined } from "../common-models/type-utils";
import { nameOf } from "../common-models/utils";
import { MonthInfoLogic } from "../logic/schedule-logic/month-info.logic";
import { PrimaryMonthRevisionDataModel } from "../state/models/application-state.model";
import {
  MonthDataArray,
  ShiftHelper,
  WorkHourInfoArray,
  WORK_HOURS_PER_DAY,
} from "./shifts.helper";
import { TranslationHelper } from "./translations.helper";
import { VerboseDateHelper } from "./verbose-date.helper";

interface WorkerInfoForCalculateWorkerHoursInfo {
  actualWorkerShifts: ShiftCode[];
  primaryScheduleWorkerShifts: MonthDataArray<ShiftCode>;
  workerNorm: number;
  month: string;
  dates: DateInformationForWorkInfoCalculation[];
}
type DateInformationForWorkInfoCalculation = Pick<
  VerboseDate,
  "isPublicHoliday" | "dayOfWeek" | "month"
>;

export class WorkerHourInfo {
  public readonly overTime: number;
  public readonly workerHourNorm: number;
  public readonly workerTime: number;

  constructor(workerHourNorm: number, workerTime: number) {
    this.workerHourNorm = Math.round(workerHourNorm);
    this.workerTime = Math.round(workerTime);
    this.overTime = this.workerTime - this.workerHourNorm;
  }

  public asArray(): WorkHourInfoArray {
    return [this.workerHourNorm, this.workerTime, this.overTime] as WorkHourInfoArray;
  }

  public static fromSchedules(
    workerName: string,
    scheduleModel: ScheduleDataModel | MonthDataModel,
    primarySchedule?: PrimaryMonthRevisionDataModel
  ): WorkerHourInfo {
    const { time } = scheduleModel.employee_info;
    const { shifts } = scheduleModel;
    let month: number, year: number;
    if (!_.isNil((scheduleModel as ScheduleDataModel).schedule_info)) {
      const info = (scheduleModel as ScheduleDataModel).schedule_info;
      month = info.month_number;
      year = info.year;
    } else {
      const info = (scheduleModel as MonthDataModel).scheduleKey;
      month = info.month;
      year = info.year;
    }
    const { dates } = scheduleModel.month_info;
    return this.fromWorkerInfo(
      shifts[workerName],
      primarySchedule?.shifts[workerName] as MonthDataArray<ShiftCode>, // TODO: modify MonthDataModel to contain only MonthDataArray
      time[workerName],
      month,
      year,
      dates
    );
  }

  public static fromWorkerInfo(
    shifts: ShiftCode[],
    primaryScheduleWorkerShifts: MonthDataArray<ShiftCode>,
    workerNorm: number,
    month: number,
    year: number,
    dates: number[]
  ): WorkerHourInfo {
    const verboseDates = new MonthInfoLogic(month, year, dates).verboseDates;
    const monthName = TranslationHelper.englishMonths[month];
    return this.calculateWorkHoursInfo({
      actualWorkerShifts: shifts,
      primaryScheduleWorkerShifts,
      workerNorm: workerNorm,
      dates: verboseDates,
      month: monthName,
    });
  }

  private static calculateWorkHoursInfo({
    actualWorkerShifts,
    workerNorm,
    dates,
    month,
    primaryScheduleWorkerShifts,
  }: WorkerInfoForCalculateWorkerHoursInfo): WorkerHourInfo {
    if (actualWorkerShifts.length !== dates.length) {
      throw Error(
        `Length of ${nameOf({ actualWorkerShifts })} should be the same as length of ${nameOf({
          dates,
        })}`
      );
    }

    const firstDayOfCurrentMonth = dates.findIndex((d) => d.month === month);
    const lastDayOfCurrentMonth = _.findLastIndex(dates, (d) => d.month === month);
    const cropToMonth = <T>(array: T[]): MonthDataArray<T> =>
      array?.slice(firstDayOfCurrentMonth, lastDayOfCurrentMonth + 1) as MonthDataArray<T>;

    const currentMonthDates = cropToMonth(dates);
    const actualShiftsFromCurrentMonth = cropToMonth(actualWorkerShifts);
    primaryScheduleWorkerShifts = primaryScheduleWorkerShifts ?? actualShiftsFromCurrentMonth;
    if (!isAllValuesDefined([primaryScheduleWorkerShifts, actualShiftsFromCurrentMonth])) {
      return new WorkerHourInfo(0, 0);
    }
    if (actualShiftsFromCurrentMonth.length !== primaryScheduleWorkerShifts.length) {
      primaryScheduleWorkerShifts = cropToMonth(primaryScheduleWorkerShifts);
    }

    if (actualShiftsFromCurrentMonth.length !== primaryScheduleWorkerShifts.length) {
      throw Error(
        `Length of ${nameOf({
          primaryScheduleWorkerShifts,
        })} should be the same as length of ${nameOf({
          actualWorkerShifts,
        })}`
      );
    }
    const requiredHours = this.calculateRequiredHoursFromVerboseDates(currentMonthDates);
    const monthShiftsWithHistoryShiftsAndDates = _.zip(
      actualShiftsFromCurrentMonth,
      primaryScheduleWorkerShifts,
      currentMonthDates
    );

    const freeHours = monthShiftsWithHistoryShiftsAndDates.reduce(
      (calculateFreeHours, shiftPair) => {
        const [actualShift, historyShift, day] = shiftPair;
        if (!ShiftHelper.isNotWorkingShift(actualShift!)) {
          return calculateFreeHours;
        }
        // ignore any free shifts in weekends
        if (!VerboseDateHelper.isWorkingDay(day)) {
          return calculateFreeHours;
        }
        const subtractFromNorm =
          actualShift === historyShift
            ? WORK_HOURS_PER_DAY
            : ShiftHelper.shiftCodeToWorkTime(SHIFTS[historyShift!]);
        return calculateFreeHours + subtractFromNorm;
      },
      0
    );
    const workerHourNorm = requiredHours * workerNorm - freeHours;
    const workerActualWorkTime = actualShiftsFromCurrentMonth.reduce(
      (acc, shift) => acc + ShiftHelper.shiftCodeToWorkTime(SHIFTS[shift!]),
      0
    );
    return new WorkerHourInfo(workerHourNorm, workerActualWorkTime);
  }

  public static calculateWorkNormForMonth(month: number, year: number): number {
    const dates = VerboseDateHelper.generateVerboseDatesForMonth(month, year);
    return Math.round(this.calculateRequiredHoursFromVerboseDates(dates));
  }

  public static calculateRequiredHoursFromVerboseDates(
    verboseDates: MonthDataArray<Pick<VerboseDate, "isPublicHoliday" | "dayOfWeek">>
  ): number {
    const workingDaysCount = verboseDates.filter((d) => VerboseDateHelper.isWorkingDay(d)).length;
    const holidaySaturdaysCount = verboseDates.filter((d) => VerboseDateHelper.isHolidaySaturday(d))
      .length;
    const requiredHours = WORK_HOURS_PER_DAY * (workingDaysCount - holidaySaturdaysCount);

    return requiredHours;
  }
}
