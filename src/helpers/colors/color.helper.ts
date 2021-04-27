/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import { CellColorSet } from "./cell-color-set.model";
import { Color, Colors } from "./color.model";

interface HrgbReturn {
  r: number;
  g: number;
  b: number;
}
export class ColorHelper {
  static get DEFAULT_COLOR_SET(): CellColorSet {
    return { textColor: Colors.BLACK, backgroundColor: Colors.WHITE };
  }

  static getHighlightColor(): Color {
    return Colors.LIGHT_BLUE.fade(0.4);
  }

  public static getBorderColor(): Color {
    return Colors.LIGHT_GREY;
  }

  public static getDefaultColor(): Color {
    return Colors.WHITE;
  }

  public static hexToRgb(hex: string): HrgbReturn | null {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
      ? {
          r: parseInt(result[1], 16),
          g: parseInt(result[2], 16),
          b: parseInt(result[3], 16),
        }
      : null;
  }
}
