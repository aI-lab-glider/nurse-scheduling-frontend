/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import { SCHEDULE_CONTAINERS_LENGTH, ScheduleContainerType } from "./schedule-data.model";

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

export function validateMonthInfo(
  monthInfo: MonthInfoModel,
  containerType: ScheduleContainerType
): void {
  const scheduleLen = monthInfo.dates.length;
  if (!SCHEDULE_CONTAINERS_LENGTH[containerType].includes(scheduleLen)) {
    throw new Error(`Schedule dates have wrong length: ${scheduleLen}`);
  }
  if (scheduleLen !== monthInfo.children_number!.length) {
    throw new Error(
      `Children number has to be specified for each ${scheduleLen} days not for ${
        monthInfo.children_number!.length
      }`
    );
  }
  if (scheduleLen !== monthInfo.extra_workers!.length) {
    throw new Error(
      `Extra workers number has to be specified for each ${scheduleLen} days not for ${
        monthInfo.extra_workers!.length
      }`
    );
  }
}
