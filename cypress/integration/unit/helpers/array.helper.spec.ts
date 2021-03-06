/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import { ArrayHelper } from "../../../../src/helpers/array.helper";

interface TestCase {
  arr1: number[];
  arr2: number[];
  exp: [number, number][];
}

const testCases: TestCase[] = [
  {
    arr1: [1, 2],
    arr2: [1, 2, 3],
    exp: [
      [1, 1],
      [2, 2],
      [undefined, 3],
    ],
  },
  {
    arr1: [1, 2],
    arr2: [1, 2],
    exp: [
      [1, 1],
      [2, 2],
    ],
  },
  {
    arr1: [1, 2, 6],
    arr2: [1, 2],
    exp: [
      [1, 1],
      [2, 2],
      [6, undefined],
    ],
  },
];

describe("ArrayHelper", () => {
  testCases.forEach((testCase) => {
    describe("zip", () => {
      it(`should return ${testCase.exp} for arrays ${testCase.arr1} and ${testCase.arr2}`, () => {
        const result = ArrayHelper.zip(testCase.arr1, testCase.arr2);
        expect(result).to.eql(testCase.exp);
      });
    });
  });
});
