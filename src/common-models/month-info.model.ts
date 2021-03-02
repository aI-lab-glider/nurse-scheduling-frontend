/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
export enum WeekDay {
  MO = "MO",
  TU = "TU",
  WE = "WE",
  TH = "TH",
  FR = "FR",
  SA = "SA",
  SU = "SU",
}

export interface VerboseDate {
  date: number;
  dayOfWeek: WeekDay;
  isPublicHoliday: boolean;
  isFrozen?: boolean;
  month: string;
}

export interface MonthInfoModel {
  children_number?: number[];
  extra_workers?: number[];
  frozen_shifts: [number | string, number][];
  dates: number[];
}
