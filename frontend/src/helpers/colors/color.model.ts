import { Colors } from "./colors";

export class Color {
  constructor(
    public readonly r: number,
    public readonly g: number,
    public readonly b: number,
    public a: number = 1
  ) {}

  public fade(opacity: number = 0.7) {
    if (this.toString() === Colors.WHITE.toString()) return Colors.LIGHT_GREY.fade();
    this.a = opacity;
    return this;
  }

  public toString() {
    return `rgba(${this.r}, ${this.g}, ${this.b}, ${this.a})`;
  }
}
