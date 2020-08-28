export type DayOfWeek = "MO" | "TU" | "WE" | "TH" | "FR" | "SA" | "SU";

export interface MonthInfoModel {
  days_of_week: DayOfWeek[];
  day_numbers: number[];
  children_number: number[];
}
