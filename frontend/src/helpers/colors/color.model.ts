import { Colors } from "./colors";

export class Color {
  constructor(
    private readonly r: number,
    private readonly g: number,
    private readonly b: number,
    private a: number = 1
  ) {}

  public fade(opacity: number = 0.5) {
    if (this.toString() === Colors.WHITE.toString()) return Colors.LIGHT_GREY.fade();
    this.a = opacity;
    return this;
  }

  public toString() {
    return `rgba(${this.r}, ${this.g}, ${this.b}, ${this.a})`;
  }
}
