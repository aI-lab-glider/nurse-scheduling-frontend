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

  public static arrayToObject<TIn, TOut extends Object>(
    array: TIn[],
    keySelector: (item: TIn) => string,
    valueSelector: (key: any, item: TIn) => TOut = (key, item) => ({} as any)
  ): { [key: string]: TOut } {
    return array
      .map((obj) => {
        const key = keySelector(obj);
        return { [key]: valueSelector(key, obj) };
      })
      .reduce((acc, curr) => ({ ...acc, ...curr }), {});
  }
}
