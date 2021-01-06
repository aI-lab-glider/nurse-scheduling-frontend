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

export const shifts: { [id: string]: Shift } = {
  R: { code: "R", name: "Rano", from: 7, to: 15, color: "FFD100", isWorkingShift: true },
  P: { code: "P", name: "Popołudnie", from: 15, to: 19, color: "00A3FF", isWorkingShift: true },
  D: { code: "D", name: "Dzień", from: 7, to: 19, color: "73B471", isWorkingShift: true },
  N: { code: "N", name: "Noc", from: 19, to: 7, color: "1D3557", isWorkingShift: true },
  DN: { code: "DN", name: "Dzień + Noc", from: 7, to: 7, color: "641EAA", isWorkingShift: true },
  PN: {
    code: "PN",
    name: "Popołudnie + Noc",
    from: 19,
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

export enum ShiftCode {
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
