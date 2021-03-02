/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import { FileHelper } from "../../../../src/helpers/file.helper";

type TestCase = { filename: string; expectedMonthYear: string };
const testCases: TestCase[] = [
  {
    filename: "maj_2021_wersja_bazowa.xlsx",
    expectedMonthYear: "maj_2021",
  },
];

describe("FileHelper", () => {
  testCases.forEach((testCase) => {
    describe("getMonthYearFromFileName", () => {
      it(`should return ${testCase.expectedMonthYear} for filename: ${testCase.filename}`, () => {
        const result = FileHelper.getDirNameFromFile(testCase.filename);
        expect(result).to.eql(testCase.expectedMonthYear);
      });
    });
  });
});
