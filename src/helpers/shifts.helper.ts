/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import { WorkerType } from "../common-models/worker-info.model";
import { Shift, ShiftCode, ShiftInfoModel, SHIFTS } from "../common-models/shift-info.model";
import { ArrayHelper } from "./array.helper";
import { CellColorSet } from "./colors/cell-color-set.model";
import { ColorHelper } from "./colors/color.helper";
import { Colors } from "./colors/color.model";
import { VerboseDateHelper } from "./verbose-date.helper";
import { VerboseDate } from "../common-models/month-info.model";
import * as _ from "lodash";

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

  public static caclulateWorkHoursInfo(
    shifts: ShiftCode[],
    workerNorm: number,
    dates: Pick<VerboseDate, "isPublicHoliday" | "dayOfWeek" | "month">[],
    currentMonth: string
  ): number[] {
    if (shifts.length !== dates.length) {
      throw Error("Shifts should be defined for each day");
    }
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
      return a + workerNorm * this.shiftCodeToWorkTime(shift!);
    }, 0);
    const overtime = actualHours - requiredHours;
    return [requiredHours, actualHours, overtime];
  }

  static getShiftColor(
    shift: ShiftCode,
    day?: VerboseDate,
    isFrozen?: boolean,
    ignoreFrozenState = false
  ): CellColorSet {
    const colorSet: CellColorSet = ColorHelper.DEFAULT_COLOR_SET;
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
