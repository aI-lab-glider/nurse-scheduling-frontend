export class ArrayHelper {
  public static zip<T, U>(array1: T[], array2: U[]): [T, U][] {
    /* eslint-disable @typescript-eslint/no-explicit-any */
    let longer: any[];
    let shorter: any[];
    if (array1.length >= array2.length) {
      [longer, shorter] = [array1, array2];
    } else {
      [longer, shorter] = [array2, array1];
    }
    return longer.map((v: any, index: number) => [v, shorter[index]]);
    /* eslint-enable @typescript-eslint/no-explicit-any */
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public static arrayToObject<TIn, TOut extends Record<string, any>>(
    array: TIn[],
    keySelector: (item: TIn) => string,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    valueSelector: (key: any, item: TIn) => TOut = (key, item): TOut => ({} as TOut)
  ): { [key: string]: TOut } {
    return array
      .map((obj) => {
        const key = keySelector(obj);
        return { [key]: valueSelector(key, obj) };
      })
      .reduce((acc, curr) => ({ ...acc, ...curr }), {});
  }
}
