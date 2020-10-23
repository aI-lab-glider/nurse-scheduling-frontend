import { Colors } from "./colors";

export class Color {
  constructor(
    public readonly r: number,
    public readonly g: number,
    public readonly b: number,
    public a: number = 1
  ) {}

  /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
  public fade(opacity = 0.7): any {
    if (this.toString() === Colors.WHITE.toString()) return Colors.LIGHT_GREY.fade();
    this.a = opacity;
    return this;
  }

  public toString(): string {
    return `rgba(${this.r}, ${this.g}, ${this.b}, ${this.a})`;
  }
}
