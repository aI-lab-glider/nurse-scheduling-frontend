/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import { VerboseDate } from "../../../../src/state/schedule-data/foundation-info/foundation-info.model";
import {
  ShiftCode,
  SHIFTS,
} from "../../../../src/state/schedule-data/shifts-types/shift-types.model";
import { ShiftHelper } from "../../../../src/helpers/shifts.helper";
import { WorkerHourInfo } from "../../../../src/helpers/worker-hours-info.model";
import { WorkerShiftsModel } from "../../../../src/state/schedule-data/workers-shifts/worker-shifts.model";

//#region getWorkersCount data
type GetWorkersCountTestCase = { arr: WorkerShiftsModel; exp: Array<number> };

const testData1: WorkerShiftsModel = {
  "0": ["R", "DN", "W"].map((d) => ShiftCode[d]),
  "1": ["P", "D", "W"].map((d) => ShiftCode[d]),
  "2": ["D", "W", "W"].map((d) => ShiftCode[d]),
};

const testData2: WorkerShiftsModel = {
  "0": ["W", "W", "W"].map((d) => ShiftCode[d]),
  "1": ["W", "W", "W"].map((d) => ShiftCode[d]),
  "2": ["W", "W", "W"].map((d) => ShiftCode[d]),
};

const testData3: WorkerShiftsModel = {
  "0": ["R", "R", "R"].map((d) => ShiftCode[d]),
  "1": ["R", "R", "R"].map((d) => ShiftCode[d]),
  "2": ["R", "R", "R"].map((d) => ShiftCode[d]),
};

const testData4: WorkerShiftsModel = {
  "0": ["R", "W", "R", "W"].map((d) => ShiftCode[d]),
  "1": ["R", "R", "R", "W"].map((d) => ShiftCode[d]),
  "2": ["R", "W", "R", "R"].map((d) => ShiftCode[d]),
};
const testData5: WorkerShiftsModel = {
  "0": ["R", "W", "R", "W"].map((d) => ShiftCode[d]),
  "1": ["R", "R", "R", "W"].map((d) => ShiftCode[d]),
  "2": ["P", "R", "R", "R"].map((d) => ShiftCode[d]),
  "3": ["R", "W", "P", "R"].map((d) => ShiftCode[d]),
  "4": ["D", "W", "R", "R"].map((d) => ShiftCode[d]),
};

const GetWorkersCountTestCases: GetWorkersCountTestCase[] = [
  {
    arr: testData1,
    exp: [3, 2, 0],
  },
  {
    arr: testData2,
    exp: [0, 0, 0],
  },
  {
    arr: testData3,
    exp: [3, 3, 3],
  },
  {
    arr: testData4,
    exp: [3, 1, 3, 1],
  },
  {
    arr: testData5,
    exp: [5, 2, 5, 3],
  },
];
//#endregion

type DateArray = Pick<VerboseDate, "isPublicHoliday" | "dayOfWeek" | "month">[];

describe("ShiftHelper", () => {
  const expectedHours = {
    [ShiftCode.RP]: 12,
    [ShiftCode.RPN]: 24,
    [ShiftCode.N8]: 8,
    [ShiftCode.D1]: 10,
    [ShiftCode.D2]: 9,
    [ShiftCode.P1]: 6,
    [ShiftCode.R1]: 6,
    [ShiftCode.R]: 8,
    [ShiftCode.P]: 4,
    [ShiftCode.D]: 12,
    [ShiftCode.N]: 12,
    [ShiftCode.DN]: 24,
    [ShiftCode.PN]: 16,
    [ShiftCode.W]: 0,
    [ShiftCode.U]: 0,
    [ShiftCode.L4]: 0,
    [ShiftCode.K]: 0,
    [ShiftCode.NZ]: 0,
  };

  Object.keys(expectedHours).forEach((shiftCode) => {
    it(`Should calculate correct duration ${shiftCode}`, () => {
      const shiftModel = SHIFTS[shiftCode];
      const hours = ShiftHelper.shiftToWorkTime(shiftModel);
      expect(hours).to.equal(expectedHours[shiftCode]);
    });
  });

  it("Should calculate correct work hours for month", () => {
    const workNorm = WorkerHourInfo.calculateWorkNormForMonth(10, 2020);
    expect(workNorm).to.equal(160);
  });

  GetWorkersCountTestCases.forEach((testCase) => {
    describe("getWorkersCount", () => {
      const shifts = Object.values(testCase.arr);
      it(`should return ${testCase.exp} for all days and array ${shifts}`, () => {
        const amount = ShiftHelper.getWorkersCount(testCase.arr, SHIFTS);
        expect(amount).to.eql(testCase.exp);
      });
    });
  });
});
