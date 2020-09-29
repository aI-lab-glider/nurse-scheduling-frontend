export type DayOfWeek = "MO" | "TU" | "WE" | "TH" | "FR" | "SA" | "SU";
export const WeekDays: DayOfWeek[] = ["MO", "TU", "WE", "TH", "FR", "SA", "SU"];

export interface MonthInfoModel {
  // first_day?: number;
  children_number?: number[];
  frozen_days: [number|string,number][];
  dates: number[];
}
