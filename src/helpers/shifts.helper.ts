import { WorkerType } from "../common-models/worker-info.model";
import { ShiftCode, ShiftInfoModel } from "../common-models/shift-info.model";
import { ArrayHelper } from "./array.helper";
import { CellColorSet } from "./colors/cell-color-set.model";
import { ColorHelper } from "./colors/color.helper";
import { Colors } from "./colors/color.model";
import { VerboseDateHelper } from "./verbose-date.helper";
import { VerboseDate } from "../common-models/month-info.model";

const WORK_HOURS_PER_DAY = 8;

export class ShiftHelper {
  public static getWorkersCount(shifts: ShiftInfoModel): Array<number> {
    const shiftsArray = Object.values(shifts);
    const workersPerDays: Array<number> = [];
    if (shiftsArray.length === 0) return [];
    for (let i = 0; i < shiftsArray[0].length; i++) {
      workersPerDays.push(
        shiftsArray.reduce((a, b) => a + (this.shiftCodeToWorkTime(b[i]) ? 1 : 0), 0)
      );
    }
    return workersPerDays;
  }

  public static isNotWorkingShift(shiftCode: ShiftCode): boolean {
    return [ShiftCode.L4, ShiftCode.U].includes(shiftCode);
  }

  public static shiftCodeToWorkTime(shiftCode: ShiftCode): number {
    switch (shiftCode) {
      case ShiftCode.R:
        return 8;
      case ShiftCode.P:
        return 4;
      case ShiftCode.D:
        return 12;
      case ShiftCode.N:
        return 12;
      case ShiftCode.DN:
        return 24;
      case ShiftCode.PN:
        return 16;
      default:
        return 0;
    }
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
    const monthData = ArrayHelper.zip(shifts, dates).slice(firstDayOfCurrentMonth);
    const workingData = monthData.filter(
      (d) => VerboseDateHelper.isWorkingDay(d[1]!) && !this.isNotWorkingShift(d[0]!)
    );
    const requiredHours = workerNorm * WORK_HOURS_PER_DAY * workingData.length;
    const actualHours = monthData.reduce(
      (a, s) => a + workerNorm * this.shiftCodeToWorkTime(s[0]!),
      0
    );
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
