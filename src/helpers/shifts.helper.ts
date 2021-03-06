/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import * as _ from "lodash";
import { VerboseDate } from "../common-models/month-info.model";
import { Shift, ShiftCode, ShiftInfoModel, SHIFTS } from "../common-models/shift-info.model";
import { WorkerType } from "../common-models/worker-info.model";
import { MonthInfoLogic } from "../logic/schedule-logic/month-info.logic";
import { ArrayHelper } from "./array.helper";
import { CellColorSet } from "./colors/cell-color-set.model";
import { ColorHelper } from "./colors/color.helper";
import { Color, Colors } from "./colors/color.model";
import { TranslationHelper } from "./translations.helper";
import { VerboseDateHelper } from "./verbose-date.helper";

const WORK_HOURS_PER_DAY = 8;

export class ShiftHelper {
  public static getWorkersCount(shifts: ShiftInfoModel): Array<number> {
    const shiftsArray = Object.values(shifts);
    const workersPerDays: Array<number> = [];
    if (shiftsArray.length === 0) return [];
    for (let i = 0; i < shiftsArray[0].length; i++) {
      workersPerDays.push(
        shiftsArray.reduce((a, b) => {
          const shift = SHIFTS[b[i]];
          return a + (this.shiftCodeToWorkTime(shift) ? 1 : 0);
        }, 0)
      );
    }
    return workersPerDays;
  }

  public static isNotWorkingShift(shiftCode: ShiftCode): boolean {
    const shift = SHIFTS[shiftCode] as Shift;
    return (!shift.isWorkingShift && shift.code !== ShiftCode.W) ?? false;
  }

  public static shiftCodeToWorkTime(shift: Shift): number {
    if (!shift.isWorkingShift) {
      return 0;
    }
    let duration = shift.to - shift.from;
    if (shift.to < shift.from) {
      const dayLenght = 24;
      duration = dayLenght - shift.from + shift.to;
    }
    return duration === 0 ? 24 : duration;
  }

  public static requiredFreeTimeAfterShift(shift: Shift): number {
    if (this.shiftCodeToWorkTime(shift) < 9) return 8;
    if (this.shiftCodeToWorkTime(shift) > 12) return 24;
    return 16;
  }

  public static nextLegalShiftStart(shift: Shift): [number, boolean] {
    const sum = shift.to + this.requiredFreeTimeAfterShift(shift);
    if (sum > 24) {
      if ((shift.to + this.requiredFreeTimeAfterShift(shift)) % 24 === 0) return [24, true];
      return [(shift.to + this.requiredFreeTimeAfterShift(shift)) % 24, true];
    }
    return [sum, false];
  }

  public static groupShiftsByWorkerType(
    shifts: ShiftInfoModel = {},
    workerTypes: { [workerName: string]: WorkerType } = {}
  ): { [key: string]: ShiftInfoModel } {
    const grouped = ArrayHelper.arrayToObject<WorkerType, ShiftInfoModel>(
      Object.values(WorkerType),
      (wt) => wt
    );
    const shiftEntries = Object.entries(shifts).map((a) => ({
      workerName: a[0],
      shifts: a[1],
    }));
    const sortedShifts = shiftEntries.sort(({ workerName: wn1 }, { workerName: wn2 }) =>
      wn1 > wn2 ? 1 : wn1 < wn2 ? -1 : 0
    );
    sortedShifts.forEach(({ workerName, shifts }) => {
      const category = workerTypes[workerName] ?? "";
      grouped[category][workerName] = shifts;
    });
    return grouped;
  }

  public static calculateWorkNormForMonth(month: number, year: number): number {
    const dates = VerboseDateHelper.generateVerboseDatesForMonth(month, year);
    return Math.round(this.calculateRequiredHoursFromVerboseDates(dates));
  }

  public static calculateRequiredHoursFromVerboseDates(
    verboseDates: Pick<VerboseDate, "isPublicHoliday" | "dayOfWeek">[]
  ): number {
    const workingDaysCount = verboseDates.filter((d) => VerboseDateHelper.isWorkingDay(d)).length;
    const holidaySaturdaysCount = verboseDates.filter((d) => VerboseDateHelper.isHolidaySaturday(d))
      .length;
    const requiredHours = WORK_HOURS_PER_DAY * (workingDaysCount - holidaySaturdaysCount);

    return requiredHours;
  }
  public static caclulateWorkHoursInfoForDates(
    shifts: ShiftCode[],
    workerNorm: number,
    month: number,
    year: number,
    dates: number[]
  ): number[] {
    const verboseDates = new MonthInfoLogic(month, year, dates).verboseDates;
    const monthName = TranslationHelper.englishMonths[month];
    return this.caclulateWorkHoursInfo(shifts, workerNorm, verboseDates, monthName);
  }

  public static caclulateWorkHoursInfo(
    shifts: ShiftCode[],
    workerNorm: number,
    dates: Pick<VerboseDate, "isPublicHoliday" | "dayOfWeek" | "month">[],
    currentMonth: string
  ): number[] {
    if (shifts === undefined) {
      return [];
    }
    if (shifts.length !== dates.length) {
      throw Error("Shifts should be defined for each day");
    }
    // TODO integrate with calculateRequiredHoursFromVerboseDates
    const firstDayOfCurrentMonth = dates.findIndex((d) => d.month === currentMonth);
    const lastDayOfCurrentMonth = _.findLastIndex(dates, (d) => d.month === currentMonth);

    const monthData = ArrayHelper.zip(shifts, dates).slice(
      firstDayOfCurrentMonth,
      lastDayOfCurrentMonth + 1
    );

    const workingDaysCount = monthData.filter(
      (d) => VerboseDateHelper.isWorkingDay(d[1]!) && !this.isNotWorkingShift(d[0]!)
    ).length;

    const holidaySaturdaysCount = monthData.filter((d) =>
      VerboseDateHelper.isHolidaySaturday(d[1]!)
    ).length;

    const requiredHours =
      workerNorm * WORK_HOURS_PER_DAY * (workingDaysCount - holidaySaturdaysCount);

    const actualHours = monthData.reduce((a, s) => {
      const shift = SHIFTS[s[0]];
      return a + this.shiftCodeToWorkTime(shift!);
    }, 0);
    const overtime = actualHours - requiredHours;
    return [requiredHours, actualHours, overtime].map((n) => Math.round(n));
  }

  private static createRGBFromHex(hexCode: string): Color {
    let hex = hexCode.replace("#", "");

    if (hex.length === 3) {
      hex = `${hex[0]}${hex[0]}${hex[1]}${hex[1]}${hex[2]}${hex[2]}`;
    }

    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
    return new Color(r, g, b, 1);
  }

  static getShiftColor(
    shift: ShiftCode,
    day?: VerboseDate,
    isFrozen?: boolean,
    ignoreFrozenState = false
  ): CellColorSet {
    const colorSet: CellColorSet = ColorHelper.DEFAULT_COLOR_SET;
    const shiftFromSHIFTS = SHIFTS[shift];

    if (shiftFromSHIFTS && shift !== "W") {
      if (shiftFromSHIFTS.isWorkingShift) {
        colorSet.textColor = this.createRGBFromHex(shiftFromSHIFTS.color!);
        return {
          ...colorSet,
          ...VerboseDateHelper.getDayColor(day, colorSet, isFrozen, ignoreFrozenState),
        };
      } else {
        colorSet.backgroundColor = this.createRGBFromHex(shiftFromSHIFTS.color!);
        return {
          ...VerboseDateHelper.getDayColor(day, colorSet, isFrozen, ignoreFrozenState),
          ...colorSet,
        };
      }
    }

    switch (shift) {
      case ShiftCode.D:
        colorSet.textColor = Colors.DARK_GREEN;
        break;
      case ShiftCode.DN:
        colorSet.textColor = Colors.DARK_GREEN;
        break;
      case ShiftCode.L4:
        colorSet.backgroundColor = Colors.RED;
        break;
      case ShiftCode.N:
        colorSet.textColor = Colors.DARK_RED;
        break;
      case ShiftCode.U:
        colorSet.backgroundColor = Colors.LIME_GREEN;
        break;
      default:
        break;
    }
    return {
      ...colorSet,
      ...VerboseDateHelper.getDayColor(day, colorSet, isFrozen, ignoreFrozenState),
    };
  }
}
