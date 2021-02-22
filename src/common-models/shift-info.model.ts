/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import { ScheduleKey } from "../api/persistance-store.model";

export interface Shift {
  code: string;
  name: string;
  from: number;
  to: number;
  color?: string;
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
}
export const SHIFTS: { [code in ShiftCode]: Shift } = {
  RP: {
    code: "RP",
    name: "Rano popłudnie",
    from: 7,
    to: 19,
    color: "FFD100",
    isWorkingShift: true,
  },
  RPN: {
    code: "RPN",
    name: "Rano, popołudni, noc",
    from: 7,
    to: 7,
    color: "9025cf",
    isWorkingShift: true,
  },
  N8: {
    code: "N8",
    name: "Noc na 8 godzin",
    from: 23,
    to: 7,
    color: "76a877",
    isWorkingShift: true,
  },
  RN8: {
    code: "RN8",
    name: "Noc na 8 godzin + Rano",
    from: 22,
    to: 15,
    color: "805646",
    isWorkingShift: true,
  },
  DN8: {
    code: "DN8",
    name: "Dzień + noc 8 godzin",
    from: 22,
    to: 19,
    color: "c9592e",
    isWorkingShift: true,
  },
  D1: {
    code: "D1",
    name: "Dzień 1",
    from: 7,
    to: 17,
    color: "396e75",
    isWorkingShift: true,
  },
  D2: {
    code: "D2",
    name: "Dzień 2",
    from: 7,
    to: 16,
    color: "eda81c",
    isWorkingShift: true,
  },
  P1: {
    code: "P1",
    name: "Popupułudnie 1",
    from: 15,
    to: 21,
    color: "2003fc",
    isWorkingShift: true,
  },
  R1: {
    code: "R1",
    name: "Rano 1",
    from: 7,
    to: 13,
    color: "5ce6dc",
    isWorkingShift: true,
  },

  R: { code: "R", name: "Rano", from: 7, to: 15, color: "a82758", isWorkingShift: true },
  P: { code: "P", name: "Popołudnie", from: 15, to: 19, color: "00A3FF", isWorkingShift: true },
  D: { code: "D", name: "Dzień", from: 7, to: 19, color: "73B471", isWorkingShift: true },
  N: { code: "N", name: "Noc", from: 19, to: 7, color: "1D3557", isWorkingShift: true },
  DN: { code: "DN", name: "Dzień + Noc", from: 7, to: 7, color: "641EAA", isWorkingShift: true },
  PN: {
    code: "PN",
    name: "Popołudnie + Noc",
    from: 15,
    to: 7,
    isWorkingShift: true,
  },
  W: { code: "W", name: "Wolne", from: 0, to: 24, isWorkingShift: false },
  U: {
    code: "U",
    name: "Urlop wypoczynkowy",
    from: 0,
    to: 24,
    color: "FF8A00",
    isWorkingShift: false,
  },
  L4: {
    code: "L4",
    name: "Zwolnienie lekarskie (L4)",
    from: 0,
    to: 24,
    color: "C60000",
    isWorkingShift: false,
  },
  K: {
    code: "K",
    name: "Kwarantanna",
    from: 0,
    to: 24,
    color: "000000",
    isWorkingShift: false,
  },
};

export interface ShiftInfoModel {
  [nurseName: string]: ShiftCode[];
}

export interface ShiftModel {
  code: string;
  from: string;
  to: string;
  color?: string;
  validityPeriod: ScheduleKey;
}
