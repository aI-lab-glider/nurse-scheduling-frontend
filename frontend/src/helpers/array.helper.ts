export class ArrayHelper {
  public static zip<T, U>(array1: T[], array2: U[]): [T, U][] {
    let longer: any[];
    let shorter: any[];
    if (array1.length >= array2.length) {
      [longer, shorter] = [array1, array2];
    } else {
      [longer, shorter] = [array2, array1];
    }
    return longer.map((v: any, index: number) => [v, shorter[index]]);
  }
}
