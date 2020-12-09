export type Primitive = undefined | null | boolean | number | string | bigint | symbol;

export class ArrayHelper {
  public static zip<T1, T2>(
    array1: (T1 | null)[],
    array2: (T2 | null)[]
  ): [T1 | null, T2 | null][] {
    if (array1.length < array2.length) {
      const count = array2.length - array1.length;
      array1 = [...array1, ...Array.from(Array(count))];
    }
    return array1.map((v, index: number) => [v, array2[index]]);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public static arrayToObject<TIn, TOut extends Record<string, any>>(
    array: TIn[],
    keySelector: (item: TIn) => string,
    valueSelector: (key: string, item: TIn) => TOut = (key, item): TOut => ({} as TOut)
  ): { [key: string]: TOut } {
    return array
      .map((obj) => {
        const key = keySelector(obj);
        return { [key]: valueSelector(key, obj) };
      })
      .reduce((acc, curr) => ({ ...acc, ...curr }), {});
  }

  public static arePrimitiveArraysEqual(array1: Primitive[], array2: Primitive[]): boolean {
    if (array1.length !== array2.length) return false;
    for (let ind = 0; ind < array1.length; ++ind) {
      if (array1[ind] !== array2[ind]) {
        return false;
      }
    }
    return true;
  }
}
