import { WorkerType } from "../common-models/worker-info.model";
import { ShiftCode, ShiftInfoModel } from "../common-models/shift-info.model";
import { ArrayHelper } from "./array.helper";
import { CellColorSet } from "./colors/cell-color-set.model";
import { ColorHelper } from "./colors/color.helper";
import { Colors } from "./colors/color.model";
import { VerboseDateHelper } from "./verbose-date.helper";
import { VerboseDate } from "../common-models/month-info.model";

export class ShiftHelper {
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
