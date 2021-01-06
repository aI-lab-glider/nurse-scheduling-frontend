/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import { VerboseDate, WeekDay } from "../common-models/month-info.model";
import { CellColorSet } from "./colors/cell-color-set.model";
import { ColorHelper } from "./colors/color.helper";
import { Colors } from "./colors/color.model";

export class VerboseDateHelper {
  static isWorkingDay(date?: Pick<VerboseDate, "isPublicHoliday" | "dayOfWeek">): boolean {
    if (!date) {
      return false;
    }
    return (
      !date.isPublicHoliday && !(date.dayOfWeek === WeekDay.SA || date.dayOfWeek === WeekDay.SU)
    );
  }

  static isHolidaySaturday(date?: Pick<VerboseDate, "isPublicHoliday" | "dayOfWeek">): boolean {
    if (!date) {
      return false;
    }
    return date.isPublicHoliday && date.dayOfWeek === WeekDay.SA;
  }

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
    if (day.isPublicHoliday) {
      colorSet = {
        backgroundColor: Colors.PINK,
        textColor: Colors.BLACK,
      };
    }
    return isFrozen && !ignoreFrozenState
      ? { ...colorSet, backgroundColor: colorSet.backgroundColor.fade() }
      : colorSet;
  }
}
