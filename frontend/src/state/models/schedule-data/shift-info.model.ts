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
  L4 = "L4",
  Wildcard = "*",
}

export interface ShiftInfoModel {
  [nurse_name: string]: ShiftCode[];
}
