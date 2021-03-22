/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import { VerboseDate } from "../common-models/month-info.model";
import {
  Shift,
  FREE_SHIFTS,
  ShiftCode,
  ShiftInfoModel,
  SHIFTS,
} from "../common-models/shift-info.model";
import { Opaque } from "../common-models/type-utils";
import { WorkerType } from "../common-models/worker-info.model";
import { ArrayHelper } from "./array.helper";
import { CellColorSet } from "./colors/cell-color-set.model";
import { ColorHelper } from "./colors/color.helper";
import { Color, Colors } from "./colors/color.model";
import { VerboseDateHelper } from "./verbose-date.helper";

export const WORK_HOURS_PER_DAY = 8;
export type MonthDataArray<T> = Opaque<"MonthData", T[]>;

export type WorkHourInfoArray = Opaque<"WorkHourInfoArray", [number, number, number]>;

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
    return !shift.isWorkingShift && shift.code !== ShiftCode.W;
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
    if (this.shiftCodeToWorkTime(shift) < 9) return 11;
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

  static replaceFreeShiftsWithFreeDay(shifts: ShiftCode[], startIndex = 0): ShiftCode[] {
    return shifts.map((shift, idx) => {
      const isIndexValid = idx >= startIndex;
      const shouldReplace = FREE_SHIFTS.includes(shift);
      return isIndexValid && shouldReplace ? ShiftCode.W : shift;
    });
  }
}
