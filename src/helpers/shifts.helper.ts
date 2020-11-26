import { WorkerType } from "../common-models/worker-info.model";
import { ShiftCode, ShiftInfoModel } from "../common-models/shift-info.model";
import { ArrayHelper } from "./array.helper";
import { CellColorSet } from "./colors/cell-color-set.model";
import { ColorHelper } from "./colors/color.helper";
import { Colors } from "./colors/color.model";
import { VerboseDateHelper } from "./verbose-date.helper";
import { VerboseDate } from "../common-models/month-info.model";
import { DataRow } from "../logic/schedule-logic/data-row";
import { ScheduleLogic } from "../logic/schedule-logic/schedule.logic";
import { ShiftsInfoLogic } from "../logic/schedule-logic/shifts-info.logic";

const WORK_HOURS_PER_DAY = 8;

export class ShiftHelper {
  public static getWorkersCount(shifts: ShiftInfoModel): Array<number> {
    const shiftsArray = Object.values(shifts);
    const workersPerDays: Array<number> = [];
    for (let i = 0; i < shiftsArray.length; i++) {
      workersPerDays.push(
        shiftsArray.reduce((a, b) => a + (this.shiftCodeToWorkTime(b[i]) ? 1 : 0), 0)
      );
    }
    return workersPerDays;
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
      const category = workerTypes[workerName] || "";
      grouped[category][workerName] = shifts;
    });
    return grouped;
  }

  public static rowWorkHoursInfo(
    dataRow: DataRow,
    scheduleLogic: ScheduleLogic | null,
    sectionKey
  ): [number, number, number] {
    if (!sectionKey) return [0, 0, 0];
    const rowData = dataRow?.rowData(true, false) ?? [];
    const monthLogic = scheduleLogic?.sections.Metadata?.monthLogic;
    const workingNorm =
      (monthLogic?.workingDaysNumber || 0) *
      WORK_HOURS_PER_DAY *
      (scheduleLogic?.getSection<ShiftsInfoLogic>(sectionKey)?.availableWorkersWorkTime[
        dataRow.rowKey
      ] || 1);
    const numberOfPreviousMonthDays = monthLogic?.numberOfPreviousMonthDays;
    const workingHours = rowData
      .slice(numberOfPreviousMonthDays)
      .reduce((previousValue, currentValue) => {
        return previousValue + ShiftHelper.shiftCodeToWorkTime(currentValue);
      }, 0);
    return [workingNorm, workingHours, workingHours - workingNorm];
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
      case (ShiftCode.P, ShiftCode.PN, ShiftCode.R, ShiftCode.W):
        break;
    }
    return {
      ...colorSet,
      ...VerboseDateHelper.getDayColor(day, colorSet, isFrozen, ignoreFrozenState),
    };
  }
}
