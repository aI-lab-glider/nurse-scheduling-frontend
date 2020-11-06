import { CellColorSet } from "./cell-color-set.model";
import { Color, Colors } from "./color.model";

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
}
