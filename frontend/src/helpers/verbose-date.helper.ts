import { VerboseDate } from "../logic/schedule-logic/month.logic";
import { WeekDay } from "../state/models/schedule-data/month-info.model";
import { CellColorSet } from "./colors/cell-color-set.model";
import { ColorHelper } from "./colors/color.helper";
import { Colors } from "./colors/color.model";

export class VerboseDateHelper {
  static getDayColor(
    day?: VerboseDate,
    defaultColorSet: CellColorSet = ColorHelper.DEFAULT_COLOR_SET,
    isFrozen = false,
    ignoreFrozenState = false
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
    return isFrozen && !ignoreFrozenState
      ? { ...colorSet, backgroundColor: colorSet.backgroundColor.fade() }
      : colorSet;
  }
}
