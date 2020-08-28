export type Shift = "R" | "P" | "D" | "N" | "DN" | "PN" | "RPN" | "W" | "U" | "L4";

export interface ShiftInfoModel {
  [nurse_name: string]: Shift[];
}
