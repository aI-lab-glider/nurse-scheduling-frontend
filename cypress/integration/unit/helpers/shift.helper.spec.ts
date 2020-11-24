/// <reference types="cypress" />
import { DataRow } from "../../../../src/logic/schedule-logic/data-row";
import { ShiftHelper } from "../../../../src/helpers/shifts.helper"
import { ShiftCode, ShiftInfoModel } from "../../../../src/common-models/shift-info.model";

type TestCase = { arr: ShiftInfoModel; exp: Array<number> };

const testData1: ShiftInfoModel = {
    "0": ["R","DN","W"].map(d => ShiftCode[d]),
    "1": ["P","D","W"].map(d => ShiftCode[d]),
    "2": ["D","W","W"].map(d => ShiftCode[d])
    };

const testData2: ShiftInfoModel = {
    "0": ["W","W","W"].map(d => ShiftCode[d]),
    "1": ["W","W","W"].map(d => ShiftCode[d]),
    "2": ["W","W","W"].map(d => ShiftCode[d])
    }   
    
const testData3: ShiftInfoModel = {
    "0": ["R","R","R"].map(d => ShiftCode[d]),
    "1": ["R","R","R"].map(d => ShiftCode[d]),
    "2": ["R","R","R"].map(d => ShiftCode[d])
    }   
    
const testCases: TestCase[] = [
    {
        arr: testData1,
        exp: [3,2,0],
    },
    {
        arr: testData2,
        exp: [0,0,0],
    },
    {
        arr: testData3,
        exp: [3,3,3],
    }
  ];
  
describe("ShiftHelper", () => {
    testCases.forEach((testCase) => {
        describe("getWorkersCount", () => {
            const shifts = Object.values(testCase.arr);
            it(`should return ${testCase.exp} for all days and array ${shifts}`, () => {
                const amount = ShiftHelper.getWorkersCount(testCase.arr);
                expect(amount).to.eql(testCase.exp);
            });
        });
    });
});
