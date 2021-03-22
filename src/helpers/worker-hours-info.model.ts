/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */

import * as _ from "lodash";
import { VerboseDate } from "../common-models/month-info.model";
import { MonthDataModel, ScheduleDataModel } from "../common-models/schedule-data.model";
import { ShiftCode, SHIFTS } from "../common-models/shift-info.model";
import { isAllValuesDefined, Opaque } from "../common-models/type-utils";
import { nameOf } from "../common-models/utils";
import { MonthInfoLogic } from "../logic/schedule-logic/month-info.logic";
import { PrimaryMonthRevisionDataModel } from "../state/models/application-state.model";
import { MonthDataArray, ShiftHelper, WORK_HOURS_PER_DAY } from "./shifts.helper";
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

const MAXIMUM_NOT_OVERTIME_HOURS = 12;

export interface WorkerHourInfoSummary {
  overTime: number;
  workerHourNorm: number;
  workerTime: number;
  workHoursDiff: number;
}

export type WorkerHourInfoSummaryTranslation = { [key in keyof WorkerHourInfoSummary]: string };

export class WorkerHourInfo {
  public readonly overTime: number;
  public readonly workerHourNorm: number;
  public readonly workerTime: number;

  constructor(workerHourNorm: number, workerTime: number, overTime: number) {
    this.workerHourNorm = Math.round(workerHourNorm);
    this.workerTime = Math.round(workerTime);
    this.overTime = Math.round(overTime);
  }

  public get workHoursDiff(): number {
    return this.workerTime - this.workerHourNorm;
  }

  public get summary(): WorkerHourInfoSummary {
    return {
      workerHourNorm: this.workerHourNorm,
      workerTime: this.workerTime,
      workHoursDiff: this.workHoursDiff,
      overTime: this.overTime,
    };
  }

  public static get summaryTranslations(): WorkerHourInfoSummaryTranslation {
    return {
      overTime: "nagodziny",
      workerHourNorm: "norma",
      workerTime: "aktualne",
      workHoursDiff: "różnica",
    };
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
    this.validateActualWorkersShifts(actualWorkerShifts, dates);

    const cropToMonth = this.createCropToMonthFunc(dates, month);
    const currentMonthDates = cropToMonth(dates);
    const actualShiftsFromCurrentMonth = cropToMonth(actualWorkerShifts);
    primaryScheduleWorkerShifts = primaryScheduleWorkerShifts ?? actualShiftsFromCurrentMonth;
    if (!isAllValuesDefined([primaryScheduleWorkerShifts, actualShiftsFromCurrentMonth])) {
      return new WorkerHourInfo(0, 0, 0);
    }
    if (actualShiftsFromCurrentMonth.length !== primaryScheduleWorkerShifts.length) {
      primaryScheduleWorkerShifts = cropToMonth(primaryScheduleWorkerShifts);
    }

    this.validatePrimaryWorkersShifts(actualShiftsFromCurrentMonth, primaryScheduleWorkerShifts);

    const workerHourNorm = this.calculateWorkerHourNorm(
      actualShiftsFromCurrentMonth,
      primaryScheduleWorkerShifts,
      currentMonthDates,
      workerNorm
    );
    const workerActualWorkTime = this.calculateWorkerActualWorkTime(actualShiftsFromCurrentMonth);
    const workerOvertime = this.calculateWorkerOvertime(
      actualShiftsFromCurrentMonth,
      primaryScheduleWorkerShifts,
      currentMonthDates,
      workerNorm
    );

    return new WorkerHourInfo(workerHourNorm, workerActualWorkTime, workerOvertime);
  }

  private static validateActualWorkersShifts(
    actualWorkerShifts: ShiftCode[],
    dates: DateInformationForWorkInfoCalculation[]
  ): void {
    if (actualWorkerShifts.length !== dates.length) {
      throw Error(
        `Length of ${nameOf({ actualWorkerShifts })} should be the same as length of ${nameOf({
          dates,
        })}`
      );
    }
  }

  private static createCropToMonthFunc(
    dates: DateInformationForWorkInfoCalculation[],
    month: string
  ): <T>(array: T[]) => Opaque<"MonthData", T[]> {
    const firstDayOfCurrentMonth = dates.findIndex((d) => d.month === month);
    const lastDayOfCurrentMonth = _.findLastIndex(dates, (d) => d.month === month);
    return <T>(array: T[]): MonthDataArray<T> =>
      array?.slice(firstDayOfCurrentMonth, lastDayOfCurrentMonth + 1) as MonthDataArray<T>;
  }

  private static validatePrimaryWorkersShifts(
    actualShiftsFromCurrentMonth: MonthDataArray<ShiftCode>,
    primaryScheduleWorkerShifts: MonthDataArray<ShiftCode>
  ): void {
    if (actualShiftsFromCurrentMonth.length !== primaryScheduleWorkerShifts.length) {
      throw Error(
        `Length of ${nameOf({
          primaryScheduleWorkerShifts,
        })} should be the same as length of ${nameOf({
          actualShiftsFromCurrentMonth,
        })}`
      );
    }
  }

  private static calculateWorkerHourNorm(
    actualShiftsFromCurrentMonth: ShiftCode[],
    primaryScheduleWorkerShifts: ShiftCode[],
    currentMonthDates: DateInformationForWorkInfoCalculation[],
    workerNorm: number
  ): number {
    const requiredHours = this.calculateRequiredHoursFromVerboseDates(currentMonthDates);
    const freeHours = this.calculateFreeHours(
      actualShiftsFromCurrentMonth,
      primaryScheduleWorkerShifts,
      currentMonthDates
    );
    return (requiredHours - freeHours) * workerNorm;
  }

  public static calculateRequiredHoursFromVerboseDates(
    verboseDates: DateInformationForWorkInfoCalculation[]
  ): number {
    const workingDaysCount = verboseDates.filter((d) => VerboseDateHelper.isWorkingDay(d)).length;
    const holidaySaturdaysCount = verboseDates.filter((d) => VerboseDateHelper.isHolidaySaturday(d))
      .length;

    return WORK_HOURS_PER_DAY * (workingDaysCount - holidaySaturdaysCount);
  }

  private static calculateFreeHours(
    actualShiftsFromCurrentMonth: ShiftCode[],
    primaryScheduleWorkerShifts: ShiftCode[],
    currentMonthDates: DateInformationForWorkInfoCalculation[]
  ): number {
    const monthShiftsWithHistoryShiftsAndDates = _.zip(
      actualShiftsFromCurrentMonth,
      primaryScheduleWorkerShifts,
      currentMonthDates
    );
    return monthShiftsWithHistoryShiftsAndDates.reduce((calculateFreeHours, shiftPair) => {
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
    }, 0);
  }

  private static calculateWorkerActualWorkTime(actualShiftsFromCurrentMonth: ShiftCode[]): number {
    return actualShiftsFromCurrentMonth.reduce(
      (acc, shift) => acc + ShiftHelper.shiftCodeToWorkTime(SHIFTS[shift!]),
      0
    );
  }

  private static calculateWorkerOvertime(
    actualShiftsFromCurrentMonth: ShiftCode[],
    primaryScheduleWorkerShifts: ShiftCode[],
    currentMonthDates: DateInformationForWorkInfoCalculation[],
    workerNorm: number
  ): number {
    const workerHourNorm = this.calculateWorkerHourNorm(
      actualShiftsFromCurrentMonth,
      primaryScheduleWorkerShifts,
      currentMonthDates,
      workerNorm
    );
    const workerActualWorkTime = this.calculateWorkerActualWorkTime(actualShiftsFromCurrentMonth);

    const diffBetweenRevisionsOvertime = this.calculateOvertimeForRevisionDifference(
      actualShiftsFromCurrentMonth,
      primaryScheduleWorkerShifts
    );
    const exceedMaximumDayWorkTimeOvertime = this.calculateOvertimeForExceeding(
      actualShiftsFromCurrentMonth,
      primaryScheduleWorkerShifts
    );

    const normAndActualDiff = workerActualWorkTime - workerHourNorm;
    const algorithmOvertime = diffBetweenRevisionsOvertime + exceedMaximumDayWorkTimeOvertime;

    return Math.max(normAndActualDiff, algorithmOvertime);
  }

  private static calculateOvertimeForRevisionDifference(
    actualShiftsFromCurrentMonth: ShiftCode[],
    primaryScheduleWorkerShifts: ShiftCode[]
  ): number {
    const monthShiftsWithHistoryShifts = _.zip(
      actualShiftsFromCurrentMonth,
      primaryScheduleWorkerShifts
    ) as [ShiftCode, ShiftCode][];

    let diffBetweenRevisionsOvertime = 0;
    monthShiftsWithHistoryShifts.forEach(([actualShift, historyShift]) => {
      if (actualShift !== historyShift) {
        const workHoursDiffBetweenRevisions =
          ShiftHelper.shiftCodeToWorkTime(SHIFTS[actualShift]) -
          ShiftHelper.shiftCodeToWorkTime(SHIFTS[historyShift]);
        diffBetweenRevisionsOvertime +=
          workHoursDiffBetweenRevisions > 0 ? workHoursDiffBetweenRevisions : 0;
      }
    });
    return diffBetweenRevisionsOvertime;
  }

  private static calculateOvertimeForExceeding(
    actualShiftsFromCurrentMonth: ShiftCode[],
    primaryScheduleWorkerShifts: ShiftCode[]
  ): number {
    const monthShiftsWithHistoryShifts = _.zip(
      actualShiftsFromCurrentMonth,
      primaryScheduleWorkerShifts
    ) as [ShiftCode, ShiftCode][];

    let exceedMaximumDayWorkTimeOvertime = 0;
    monthShiftsWithHistoryShifts
      .filter(([actualShift, historyShift]) => actualShift === historyShift)
      .map(([actualShift]) => actualShift)
      .forEach((shift) => {
        const shiftWorkTime = ShiftHelper.shiftCodeToWorkTime(SHIFTS[shift]);
        if (shiftWorkTime > MAXIMUM_NOT_OVERTIME_HOURS) {
          const overTime = shiftWorkTime - MAXIMUM_NOT_OVERTIME_HOURS;
          exceedMaximumDayWorkTimeOvertime += overTime > 0 ? overTime : 0;
        }
      });
    return exceedMaximumDayWorkTimeOvertime;
  }

  public static calculateWorkNormForMonth(month: number, year: number): number {
    const dates = VerboseDateHelper.generateVerboseDatesForMonth(month, year);
    return Math.round(this.calculateRequiredHoursFromVerboseDates(dates));
  }
}
