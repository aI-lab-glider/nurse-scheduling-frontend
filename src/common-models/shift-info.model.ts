import { ScheduleKey } from "../api/persistance-store.model";

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

export interface DisplayedShiftData {
  name: ShiftName;
  code: ShiftCode;
  hours: ShiftHours;
  color?: string;
}

export enum ShiftName {
  R = "Rano",
  P = "Popołudnie",
  D = "Dzień",
  N = "Noc",
  U = "Urlop wypoczynkowy",
  L4 = "Zwolnienie lekarskie (L4)",
}

export enum ShiftHours {
  R = "8:00 - 12:00",
  P = "14:00 - 20:00",
  D = "8:00 - 16:00",
  N = "22:00 - 6:00",
  U = "-",
  L4 = "-",
}
