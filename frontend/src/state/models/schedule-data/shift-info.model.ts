export type Shift = "R" | "P" | "D" | "N" | "DN" | "PN" | "RPN" | "W" | "U" | "L4" | null;

export enum ShiftCode {
  R = "R",
  P = "P",
  D = "D",
  N = "N",
  DN = "DN",
  PN = "PN",
  RPN = "RPN",
  W = "W",
  U = "U",
  L4 = "L4"
}

export interface ShiftInfoModel {
  [nurse_name: string]: Shift[];
}
