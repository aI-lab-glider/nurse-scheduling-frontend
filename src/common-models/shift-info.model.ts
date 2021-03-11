/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */

import { SCHEDULE_CONTAINERS_LENGTH, ScheduleContainerType } from "./schedule-data.model";
import * as _ from "lodash";

export interface Shift {
  code: string;
  name: string;
  from: number;
  to: number;
  color: string;
  isWorkingShift?: boolean;
}

export enum ShiftCode {
  RP = "RP",
  RPN = "RPN",
  N8 = "N8",
  RN8 = "RN8",
  DN8 = "DN8",
  D1 = "D1",
  D2 = "D2",
  P1 = "P1",
  R1 = "R1",
  R = "R",
  P = "P",
  D = "D",
  N = "N",
  DN = "DN",
  PN = "PN",
  W = "W",
  U = "U",
  L4 = "L4",
  K = "K",
  NZ = "NZ",
  OP = "OP",
  OK = "OK",
}
export const SHIFTS: { [code in ShiftCode]: Shift } = {
  RP: {
    code: "RP",
    name: "rano, popołudnie",
    from: 7,
    to: 19,
    color: "FFD100",
    isWorkingShift: true,
  },
  RPN: {
    code: "RPN",
    name: "rano, popołudnie, noc",
    from: 7,
    to: 7,
    color: "9025cf",
    isWorkingShift: true,
  },
  N8: {
    code: "N8",
    name: "noc 8h",
    from: 23,
    to: 7,
    color: "76a877",
    isWorkingShift: true,
  },
  RN8: {
    code: "RN8",
    name: "noc 8h, rano",
    from: 22,
    to: 15,
    color: "805646",
    isWorkingShift: true,
  },
  DN8: {
    code: "DN8",
    name: "dzień, noc 8h",
    from: 22,
    to: 19,
    color: "c9592e",
    isWorkingShift: true,
  },
  D1: {
    code: "D1",
    name: "dzień 1",
    from: 7,
    to: 17,
    color: "396e75",
    isWorkingShift: true,
  },
  D2: {
    code: "D2",
    name: "dzień 2",
    from: 7,
    to: 16,
    color: "eda81c",
    isWorkingShift: true,
  },
  P1: {
    code: "P1",
    name: "popołudnie 1",
    from: 15,
    to: 21,
    color: "2003fc",
    isWorkingShift: true,
  },
  R1: {
    code: "R1",
    name: "rano 1",
    from: 7,
    to: 13,
    color: "5ce6dc",
    isWorkingShift: true,
  },

  R: { code: "R", name: "rano", from: 7, to: 15, color: "a82758", isWorkingShift: true },
  P: { code: "P", name: "popołudnie", from: 15, to: 19, color: "00A3FF", isWorkingShift: true },
  D: { code: "D", name: "dzień", from: 7, to: 19, color: "73B471", isWorkingShift: true },
  N: { code: "N", name: "noc", from: 19, to: 7, color: "1D3557", isWorkingShift: true },
  DN: { code: "DN", name: "dzień, noc", from: 7, to: 7, color: "641EAA", isWorkingShift: true },
  PN: {
    code: "PN",
    name: "popołudnie, noc",
    from: 15,
    to: 7,
    color: "FFD100",
    isWorkingShift: true,
  },
  W: { code: "W", name: "wolne", from: 0, to: 24, color: "FF8A00", isWorkingShift: false },
  U: {
    code: "U",
    name: "urlop wypoczynkowy",
    from: 0,
    to: 24,
    color: "FF8A00",
    isWorkingShift: false,
  },
  L4: {
    code: "L4",
    name: "zwolnienie lekarskie (L4)",
    from: 0,
    to: 24,
    color: "C60000",
    isWorkingShift: false,
  },
  K: {
    code: "K",
    name: "kwarantanna",
    from: 0,
    to: 24,
    color: "000000",
    isWorkingShift: false,
  },
  OP: {
    code: "OP",
    name: "urlop opiekuńczy",
    from: 0,
    to: 24,
    color: "fc03e7",
    isWorkingShift: false,
  },
  OK: {
    code: "OK",
    name: "urlop okolicznościowy",
    from: 0,
    to: 24,
    color: "56f5f5",
    isWorkingShift: false,
  },
  NZ: {
    code: "NZ",
    name: "niezatrudniony",
    from: 0,
    to: 24,
    color: "000000",
    isWorkingShift: false,
  },
};

export const FREE_SHIFTS = Object.values(SHIFTS)
  .filter((shift) => !shift.isWorkingShift && shift.code !== "W")
  .map((shift) => shift.code);

export const WORKING_SHIFTS = Object.values(SHIFTS)
  .filter((shift) => shift.isWorkingShift)
  .map((shift) => shift.code);

export interface ShiftInfoModel {
  [nurseName: string]: ShiftCode[];
}

export interface ShiftModel {
  [shiftCode: string]: Shift;
}

export function validateShiftInfoModel(
  shifts: ShiftInfoModel,
  containerType: ScheduleContainerType
): void {
  if (shifts !== undefined && !_.isEmpty(shifts)) {
    const [worker, workerShifts] = Object.entries(shifts)[0];
    const shiftLen = workerShifts.length;
    if (!SCHEDULE_CONTAINERS_LENGTH[containerType].includes(shiftLen)) {
      throw new Error(
        `Schedule shift for worker ${worker} have wrong length: ${shiftLen} it should be on of ${SCHEDULE_CONTAINERS_LENGTH[containerType]}`
      );
    }
    Object.entries(shifts).forEach(([workerName, shift]) => {
      if (shift.length !== shiftLen) {
        throw new Error(`Shifts for worker: ${workerName} have wrong length: ${shift.length}`);
      }
    });
  }
}
