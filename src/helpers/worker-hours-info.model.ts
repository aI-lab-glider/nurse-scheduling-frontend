/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */

import * as _ from "lodash";
import { VerboseDate } from "../common-models/month-info.model";
import { ScheduleDataModel } from "../common-models/schedule-data.model";
import { ShiftCode, SHIFTS } from "../common-models/shift-info.model";
import { isAgrumentsDefined } from "../common-models/type-utils";
import { MonthInfoLogic } from "../logic/schedule-logic/month-info.logic";
import { BaseMonthRevisionDataModel } from "../state/models/application-state.model";
import { TranslationHelper } from "./translations.helper";
import { VerboseDateHelper } from "./verbose-date.helper";
import {
  WorkHourInfoArray,
  MonthDataArray,
  ShiftHelper,
  WORK_HOURS_PER_DAY,
} from "./shifts.helper";

interface WorkerInfoForCalculateWorkerHoursInfo {
  shifts?: ShiftCode[];
  baseWorkerShifts?: ShiftCode[];
  workerNorm?: number;
  month?: number;
  year?: number;
  dates?: number[];
}
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
    return this.fromWorkerInfo({
      shifts: shifts[workerName],
      baseWorkerShifts: baseSchedule.shifts[workerName],
      workerNorm: time[workerName],
      month,
      year,
      dates,
    });
  }

  public static fromWorkerInfo({
    baseWorkerShifts,
    ...rest
  }: WorkerInfoForCalculateWorkerHoursInfo): WorkerHourInfo {
    if (!isAgrumentsDefined(rest)) {
      return new WorkerHourInfo(0, 0);
    }
    const { shifts, workerNorm, month, year, dates } = rest;
    const verboseDates = new MonthInfoLogic(month, year, dates).verboseDates;
    const monthName = TranslationHelper.englishMonths[month];
    return this.caclulateWorkHoursInfo(
      shifts,
      baseWorkerShifts ?? shifts,
      workerNorm,
      verboseDates,
      monthName
    );
  }

  public static caclulateWorkHoursInfo(
    actualShifts: ShiftCode[],
    baseWorkerShifts: ShiftCode[],
    workerNorm: number,
    dates: Pick<VerboseDate, "isPublicHoliday" | "dayOfWeek" | "month">[],
    currentMonth: string
  ): WorkerHourInfo {
    if (actualShifts.length !== dates.length) {
      throw Error("Shifts should be defined for each day");
    }
    if (_.isNil(baseWorkerShifts)) {
      baseWorkerShifts = actualShifts;
    }
    const firstDayOfCurrentMonth = dates.findIndex((d) => d.month === currentMonth);
    const lastDayOfCurrentMonth = _.findLastIndex(dates, (d) => d.month === currentMonth);

    const cropToMonth = <T>(array: T[]): MonthDataArray<T> =>
      array.slice(firstDayOfCurrentMonth, lastDayOfCurrentMonth + 1) as MonthDataArray<T>;

    debugger;
    const requiredHours = this.calculateRequiredHoursFromVerboseDates(cropToMonth(dates));
    const monthShiftsWithHistoryShifts = _.zip(
      cropToMonth(actualShifts),
      cropToMonth(baseWorkerShifts)
    );
    debugger;
    const freeHours = monthShiftsWithHistoryShifts.reduce((calculatedHours, shiftPair) => {
      const [actualShift, historyShift] = shiftPair;
      if (!ShiftHelper.isNotWorkingShift(actualShift!)) {
        return calculatedHours;
      }
      // If shift is not working shift and shift same as in base plan,
      // than we substract work norm.
      // Otherwise, we should substract duration of corresponding working shift from base plan
      const substractFromNorm =
        actualShift === historyShift
          ? WORK_HOURS_PER_DAY
          : ShiftHelper.shiftCodeToWorkTime(SHIFTS[historyShift!]);
      return calculatedHours + substractFromNorm;
    }, 0);

    const workerHourNorm = (requiredHours - freeHours) * workerNorm;
    const workerTime = actualShifts.reduce(
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
