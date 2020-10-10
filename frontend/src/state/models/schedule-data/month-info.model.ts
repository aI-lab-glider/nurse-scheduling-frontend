export type DayOfWeek = "MO" | "TU" | "WE" | "TH" | "FR" | "SA" | "SU";
export const WeekDays: DayOfWeek[] = ["MO", "TU", "WE", "TH", "FR", "SA", "SU"];

export interface MonthInfoModel {
  children_number?: number[];
  extra_workers?: number[];
  frozen_shifts: [number  |  string,  number][];
  dates: number[];
}