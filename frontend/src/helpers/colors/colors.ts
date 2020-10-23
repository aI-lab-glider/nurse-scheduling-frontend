import { Color } from "./color.model";

export class Colors {
  public static get LIGHT_BLUE(): Color {
    return new Color(137, 172, 255);
  }
  public static get TUSCANY(): Color {
    return new Color(252, 209, 42);
  }
  public static get RED(): Color {
    return new Color(255, 0, 0);
  }
  public static get FADED_GREEN(): Color {
    return new Color(195, 214, 155);
  }
  public static get BEAUTY_BUSH(): Color {
    return new Color(250, 192, 144);
  }
  public static get LIGHT_GREY(): Color {
    return new Color(210, 210, 210);
  }
  public static get DARK_GREEN(): Color {
    return new Color(0, 100, 0);
  }
  public static get DARK_RED(): Color {
    return new Color(139, 0, 0);
  }
  public static get BLACK(): Color {
    return new Color(0, 0, 0);
  }
  public static get WHITE(): Color {
    return new Color(255, 255, 255);
  }
  public static get LIME_GREEN(): Color {
    return new Color(50, 205, 50);
  }
  public static get SLATE_BLUE(): Color {
    return new Color(106, 90, 205);
  }
  public static get DARK_SLATE_BLUE(): Color {
    return new Color(72, 61, 139);
  }
}
