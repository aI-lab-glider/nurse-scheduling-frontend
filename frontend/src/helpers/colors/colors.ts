import { Color } from "./color.model";

export class Colors {
  public static get RED() {
    return new Color(255, 0, 0);
  }
  public static get FADED_GREEN() {
    return new Color(149, 158, 131);
  }
  public static get BEAUTY_BUSH() {
    return new Color(229, 184, 183);
  }
  public static get LIGHT_GREY() {
    return new Color(210, 210, 210);
  }
  public static get DARK_GREEN() {
    return new Color(0, 100, 0);
  }
  public static get DARK_RED() {
    return new Color(139, 0, 0);
  }
  public static get BLACK() {
    return new Color(0, 0, 0);
  }
  public static get WHITE() {
    return new Color(255, 255, 255);
  }
  public static get LIME_GREEN() {
    return new Color(50, 205, 50);
  }
  public static get SLATE_BLUE() {
    return new Color(106, 90, 205);
  }
  public static get DARK_SLATE_BLUE() {
    return new Color(72, 61, 139);
  }
}
