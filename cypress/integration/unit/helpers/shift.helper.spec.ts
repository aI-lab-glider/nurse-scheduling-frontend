/// <reference types="cypress" />
import { DataRow } from "../../../../src/logic/schedule-logic/data-row";
import { ShiftHelper } from "../../../../src/helpers/shifts.helper"

type TestCase = { arr: DataRow[]; day: number; exp: number };

const testData = [
    new DataRow("", ["R","DN","W"]),
    new DataRow("", ["P","D","W"]),
    new DataRow("", ["D","W","W"])
    ]

const testCases: TestCase[] = [
    {
        arr: testData,
        day: 0,
        exp: 3,
    },
    {
        arr: testData,
        day: 1,
        exp: 2,
    },
    {
        arr: testData,
        day: 2,
        exp: 0,
    }
  ];
  
describe("ShiftHelper", () => {
    testCases.forEach((testCase) => {
        describe("getWorkersCount", () => {
            const shifts = testCase.arr.map(d => d.rowData(false, false));
            it(`should return ${testCase.exp} for day ${testCase.day} and array ${shifts}`, () => {
                const amount = ShiftHelper.getWorkersCount(testCase.day, testData);
                expect(amount).to.equal(testCase.exp);
            });
        });
    });
});
