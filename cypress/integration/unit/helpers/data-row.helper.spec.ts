/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import { DataRowHelper } from "../../../../src/helpers/data-row.helper";
import { DataRow } from "../../../../src/logic/schedule-logic/data-row";

type EqualityTest = { row1: DataRow; row2: DataRow; exp: boolean };
type UpdateIndicesTest = {
  dataRows: DataRow;
  updateIndices: number[];
  newValue: string;
  expected: DataRow;
};

const equalityTestCases: EqualityTest[] = [
  {
    row1: new DataRow("test", [5, 2, 15, 84]),
    row2: new DataRow("test", [5, 2, 15, 84]),
    exp: true,
  },
  {
    row1: new DataRow("test", [84, 15, 2, 5]),
    row2: new DataRow("test", [5, 2, 15, 84]),
    exp: false,
  },
  {
    row1: new DataRow("not a test", [84, 15, 2, 5]),
    row2: new DataRow("test", [5, 2, 15, 84]),
    exp: false,
  },
  {
    row1: new DataRow("not a test", [84, 15, 2, 5]),
    row2: new DataRow("test", [84, 15, 2, 5]),
    exp: false,
  },
];

const expectedValue = "99";
const updateIndicesTestCases: UpdateIndicesTest[] = [
  {
    dataRows: new DataRow("Dzieci", [51, 3, 27, 22, 17, 11]),
    updateIndices: [1, 2, 5],
    newValue: expectedValue,
    expected: new DataRow("Dzieci", [51, expectedValue, expectedValue, 22, 17, expectedValue]),
  },
  {
    dataRows: new DataRow("Dzieci", [49, 66, 14, 44, 85, 48, 13]),
    updateIndices: [3],
    newValue: expectedValue,
    expected: new DataRow("Dzieci", [49, 66, 14, expectedValue, 85, 48, 13]),
  },
];

describe("DataRowHelper", () => {
  equalityTestCases.forEach((testCase) => {
    describe("rows equality", () => {
      it(`should return ${testCase.exp} for datarows ${testCase.row1} and ${testCase.row2}`, () => {
        const result = DataRowHelper.areDataRowsEqual(testCase.row1, testCase.row2);
        expect(result).to.eql(testCase.exp);
      });
    });
  });
  updateIndicesTestCases.forEach((testCase) => {
    describe("updating datarows", () => {
      it(`should return ${testCase.expected} for datarows ${testCase.dataRows}`, () => {
        const result = DataRowHelper.updateDataRowIndices(
          testCase.dataRows,
          testCase.updateIndices,
          testCase.newValue
        );
        expect(result).to.eql(testCase.expected);
      });
    });
  });
});
