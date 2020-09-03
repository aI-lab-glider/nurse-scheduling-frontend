export type Shift = "R" | "P" | "D" | "N" | "DN" | "PN" | "RPN" | "W" | "U" | "L4" | null;

export interface ShiftInfoModel {
  [nurse_name: string]: Shift[];
}
