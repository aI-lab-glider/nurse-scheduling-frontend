import { VerboseDate } from "../../logic/real-schedule-logic/month.logic";
import { WeekDay } from "../../state/models/schedule-data/month-info.model";
import { ShiftCode } from "../../state/models/schedule-data/shift-info.model";
import { CellColorSet } from "./cell-color-set.model";
import { Colors } from "./colors";

export class ColorProvider {
  static get DEFAULT_COLOR_SET(): CellColorSet {
    return { textColor: Colors.BLACK, backgroundColor: Colors.WHITE };
  }

  static getShiftColor(
    shift: ShiftCode,
    day?: VerboseDate,
    ignoreFrozenState: boolean = false
  ): CellColorSet {
    let colorSet: CellColorSet = ColorProvider.DEFAULT_COLOR_SET;
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
      case (ShiftCode.P, ShiftCode.PN, ShiftCode.R, ShiftCode.W):
        break;
    }
    return { ...colorSet, ...ColorProvider.getDayColor(day, colorSet, ignoreFrozenState) };
  }

  static getDayColor(
    day?: VerboseDate,
    defaultColorSet: CellColorSet = ColorProvider.DEFAULT_COLOR_SET,
    ignoreFrozenState: boolean = false
  ): CellColorSet {
    if (!day) {
      return defaultColorSet;
    }
    let colorSet = { ...defaultColorSet };
    switch (day.dayOfWeek) {
      case WeekDay.SA:
        colorSet = {
          backgroundColor: Colors.FADED_GREEN,
          textColor: Colors.BLACK,
        };
        break;
      case WeekDay.SU:
        colorSet = {
          backgroundColor: Colors.BEAUTY_BUSH,
          textColor: Colors.BLACK,
        };
        break;
    }
    return day.isFrozen && !ignoreFrozenState
      ? { ...colorSet, backgroundColor: colorSet.backgroundColor.fade() }
      : colorSet;
  }
}
