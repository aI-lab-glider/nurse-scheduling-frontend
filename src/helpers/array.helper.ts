/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
export type Primitive = undefined | null | boolean | number | string | bigint | symbol;

type ValueOrNotDefined<T> = T extends NonNullable<T> ? T : T | null | undefined;
export class ArrayHelper {
  public static zip<T1, T2>(
    array1: ValueOrNotDefined<T1>[] = [],
    array2: ValueOrNotDefined<T2>[] = []
  ): [ValueOrNotDefined<T1>, ValueOrNotDefined<T2>][] {
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
