/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import { ShiftCode, ShiftInfoModel } from "../../../../src/common-models/shift-info.model";

export type GetWorkersCountTestCase = { arr: ShiftInfoModel; exp: Array<number> };

export const testData1: ShiftInfoModel = {
  "0": ["R", "DN", "W"].map((d) => ShiftCode[d]),
  "1": ["P", "D", "W"].map((d) => ShiftCode[d]),
  "2": ["D", "W", "W"].map((d) => ShiftCode[d]),
};

export const testData2: ShiftInfoModel = {
  "0": ["W", "W", "W"].map((d) => ShiftCode[d]),
  "1": ["W", "W", "W"].map((d) => ShiftCode[d]),
  "2": ["W", "W", "W"].map((d) => ShiftCode[d]),
};

export const testData3: ShiftInfoModel = {
  "0": ["R", "R", "R"].map((d) => ShiftCode[d]),
  "1": ["R", "R", "R"].map((d) => ShiftCode[d]),
  "2": ["R", "R", "R"].map((d) => ShiftCode[d]),
};

export const testData4: ShiftInfoModel = {
  "0": ["R", "W", "R", "W"].map((d) => ShiftCode[d]),
  "1": ["R", "R", "R", "W"].map((d) => ShiftCode[d]),
  "2": ["R", "W", "R", "R"].map((d) => ShiftCode[d]),
};
export const testData5: ShiftInfoModel = {
  "0": ["R", "W", "R", "W"].map((d) => ShiftCode[d]),
  "1": ["R", "R", "R", "W"].map((d) => ShiftCode[d]),
  "2": ["P", "R", "R", "R"].map((d) => ShiftCode[d]),
  "3": ["R", "W", "P", "R"].map((d) => ShiftCode[d]),
  "4": ["D", "W", "R", "R"].map((d) => ShiftCode[d]),
};

export const GetWorkersCountTestCases: GetWorkersCountTestCase[] = [
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

export const expectedHours = {
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
