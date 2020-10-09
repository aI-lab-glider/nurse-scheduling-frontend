export enum WeekDay {
  MO = "MO",
  TU = "TU",
  WE = "WE",
  TH = "TH",
  FR = "FR",
  SA = "SA",
  SU = "SU"
};

export interface MonthInfoModel {
  children_number?: number[];
  extra_workers?: number[];
  frozen_shifts: [number  |  string,  number][];
  dates: number[];
}