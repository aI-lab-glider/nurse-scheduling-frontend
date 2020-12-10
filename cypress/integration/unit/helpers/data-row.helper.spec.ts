import { DataRow } from "../../../../src/logic/schedule-logic/data-row";
import { DataRowHelper } from "../../../../src/helpers/data-row.helper";

type EqualityTest = { row1: DataRow; row2: DataRow; exp: boolean };
type UpdateIndiciesTest = {
  dataRows: DataRow[];
  rowIndex: number;
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
    row1: new DataRow("not a test", [84, 15, 2, 5]),
    row2: new DataRow("test", [5, 2, 15, 84]),
    exp: false,
  },
];
const updateIndiciesTestCases: UpdateIndiciesTest[] = [
  {
    dataRows: [new DataRow("Dzieci", [51, 3, 27, 22, 17, 11])],
    rowIndex: 0,
    updateIndices: [1, 2, 5],
    newValue: "66",
    expected: new DataRow("Dzieci", [51, "66", "66", 22, 17, "66"]),
  },
  {
    dataRows: [
      new DataRow("Dzieci", [51, 3, 27, 22, 17, 11]),
      new DataRow("Dzieci", [49, 66, 14, 44, 85, 48, 13]),
    ],
    rowIndex: 1,
    updateIndices: [3],
    newValue: "99",
    expected: new DataRow("Dzieci", [49, 66, 14, "99", 85, 48, 13]),
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
  updateIndiciesTestCases.forEach((testCase) => {
    describe("updating datarows", () => {
      it(`should return ${testCase.expected} for datarows ${testCase.dataRows}`, () => {
        const result = DataRowHelper.updateDataRowsIndicies(
          testCase.dataRows,
          testCase.rowIndex,
          testCase.updateIndices,
          testCase.newValue
        );
        expect(result).to.eql(testCase.expected);
      });
    });
  });
});
