/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */

import * as _ from "lodash";
import { VerboseDate } from "../common-models/month-info.model";
import { ScheduleDataModel } from "../common-models/schedule-data.model";
import { ShiftCode, SHIFTS } from "../common-models/shift-info.model";
import { isAllValuesDefined } from "../common-models/type-utils";
import { nameOf } from "../common-models/utils";
import { MonthInfoLogic } from "../logic/schedule-logic/month-info.logic";
import { BaseMonthRevisionDataModel } from "../state/models/application-state.model";
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
  baseWorkerShifts: MonthDataArray<ShiftCode>;
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
    scheduleModel: ScheduleDataModel,
    baseSchedule: BaseMonthRevisionDataModel
  ): WorkerHourInfo {
    const { time } = scheduleModel.employee_info;
    const { shifts } = scheduleModel;
    const { month_number: month, year } = scheduleModel.schedule_info;
    const { dates } = scheduleModel.month_info;
    return this.fromWorkerInfo(
      shifts[workerName],
      baseSchedule.shifts[workerName] as MonthDataArray<ShiftCode>, // TODO: modify MonthDataModel to contain only MonthDataArray
      time[workerName],
      month,
      year,
      dates
    );
  }

  public static fromWorkerInfo(
    shifts: ShiftCode[],
    baseWorkerShifts: MonthDataArray<ShiftCode>,
    workerNorm: number,
    month: number,
    year: number,
    dates?: number[]
  ): WorkerHourInfo {
    const verboseDates = new MonthInfoLogic(month, year, dates).verboseDates;
    const monthName = TranslationHelper.englishMonths[month];
    return this.calculateWorkHoursInfo({
      actualWorkerShifts: shifts,
      baseWorkerShifts: baseWorkerShifts,
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
    baseWorkerShifts,
  }: WorkerInfoForCalculateWorkerHoursInfo): WorkerHourInfo {
    if (actualWorkerShifts.length !== dates.length) {
      throw Error(
        `Length of ${nameOf({ actualWorkerShifts })} should be the same as length of ${nameOf({
          baseWorkerShifts,
        })}`
      );
    }

    const firstDayOfCurrentMonth = dates.findIndex((d) => d.month === month);
    const lastDayOfCurrentMonth = _.findLastIndex(dates, (d) => d.month === month);
    const cropToMonth = <T>(array: T[]): MonthDataArray<T> =>
      array.slice(firstDayOfCurrentMonth, lastDayOfCurrentMonth + 1) as MonthDataArray<T>;

    const actualShiftsFromCurrentMonth = cropToMonth(actualWorkerShifts);
    baseWorkerShifts = baseWorkerShifts ?? actualShiftsFromCurrentMonth;

    if (!isAllValuesDefined([baseWorkerShifts, actualWorkerShifts])) {
      return new WorkerHourInfo(0, 0);
    }

    if (actualShiftsFromCurrentMonth.length !== baseWorkerShifts.length) {
      throw Error(
        `Length of ${nameOf({ baseWorkerShifts })} should be the same as length of ${nameOf({
          actualWorkerShifts,
        })}`
      );
    }

    const requiredHours = this.calculateRequiredHoursFromVerboseDates(cropToMonth(dates));
    const monthShiftsWithHistoryShifts = _.zip(cropToMonth(actualWorkerShifts), baseWorkerShifts);

    const freeHours = monthShiftsWithHistoryShifts.reduce((calculatedHours, shiftPair) => {
      const [actualShift, historyShift] = shiftPair;
      if (!ShiftHelper.isNotWorkingShift(actualShift!)) {
        return calculatedHours;
      }
      const subtractFromNorm =
        actualShift === historyShift
          ? WORK_HOURS_PER_DAY
          : ShiftHelper.shiftCodeToWorkTime(SHIFTS[historyShift!]);
      return calculatedHours + subtractFromNorm;
    }, 0);

    const workerHourNorm = requiredHours * workerNorm - freeHours;
    const workerTime = actualWorkerShifts.reduce(
      (acc, shift) => acc + ShiftHelper.shiftCodeToWorkTime(SHIFTS[shift!]),
      0
    );
    return new WorkerHourInfo(workerHourNorm, workerTime);
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
