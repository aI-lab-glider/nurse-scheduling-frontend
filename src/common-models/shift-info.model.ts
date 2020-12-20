import { ScheduleKey } from "../api/persistance-store.model";

export interface Shift {
  code: string;
  name: string;
  from: number;
  to: number;
  color: string;
  isWorkingShift?: boolean;
}

export const shifts: { [id: string]: Shift } = {
  R: { code: "R", name: "Rano", from: 7, to: 15, color: "FFE880", isWorkingShift: true },
  P: { code: "P", name: "Popołudnie", from: 15, to: 19, color: "B3E3FF", isWorkingShift: true },
  D: { code: "D", name: "Dzień", from: 7, to: 19, color: "CBEECB", isWorkingShift: true },
  N: { code: "N", name: "Noc", from: 19, to: 7, color: "B7BCC7", isWorkingShift: true },
  DN: { code: "DN", name: "Dzień + Noc", from: 7, to: 7, color: "", isWorkingShift: true },
  PN: {
    code: "PN",
    name: "Popołudn + Noc",
    from: 19,
    to: 7,
    color: "",
    isWorkingShift: true,
  },
  W: { code: "W", name: "Wolne", from: 0, to: 24, color: "", isWorkingShift: false },
  U: {
    code: "U",
    name: "Urlop wypoczynkowy",
    from: 0,
    to: 24,
    color: "FFDBC3",
    isWorkingShift: false,
  },
  L4: {
    code: "L4",
    name: "Zwolnienie lekarskie (L4)",
    from: 0,
    to: 24,
    color: "EEB3B3",
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
