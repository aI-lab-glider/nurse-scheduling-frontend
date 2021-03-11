/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import { SCHEDULE_CONTAINERS_LENGTH, ScheduleContainerType } from "./schedule-data.model";
import { MonthHelper } from "../helpers/month.helper";
import { ScheduleKey } from "../api/persistance-store.model";
import * as _ from "lodash";

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
  frozen_shifts?: [number | string, number][];
  dates: number[];
}

export function validateMonthInfo(
  monthInfo: MonthInfoModel,
  containerType: ScheduleContainerType
): void {
  const scheduleLen = monthInfo.dates.length;
  if (!SCHEDULE_CONTAINERS_LENGTH[containerType].includes(scheduleLen)) {
    throw new Error(
      `Schedule dates have wrong length: ${scheduleLen}. It should be equal to one of: ${SCHEDULE_CONTAINERS_LENGTH[containerType]}`
    );
  }
  if (monthInfo.children_number !== undefined && scheduleLen !== monthInfo.children_number.length) {
    throw new Error(
      `Children number should have the same length as schedule equal to ${scheduleLen} not: ${monthInfo.children_number.length}`
    );
  }
  if (monthInfo.extra_workers !== undefined && scheduleLen !== monthInfo.extra_workers.length) {
    throw new Error(
      `Extra workers should have the same length as schedule equal to ${scheduleLen} not ${monthInfo.extra_workers.length}`
    );
  }
}

export function createDatesForMonth(year: number, month: number): number[] {
  const {
    daysMissingFromPrevMonth,
    daysMissingFromNextMonth,
  } = MonthHelper.calculateMissingFullWeekDays(new ScheduleKey(month, year));
  const prevMonthKey = new ScheduleKey(month, year).prevMonthKey;
  const prevMonthLength = MonthHelper.getMonthLength(prevMonthKey.year, prevMonthKey.month);
  const prevMonthDates = _.range(
    prevMonthLength - daysMissingFromPrevMonth + 1,
    prevMonthLength + 1
  );

  const currentMonthDates = MonthHelper.daysInMonth(month, year);
  const nextMonthDates = _.range(1, daysMissingFromNextMonth + 1);

  return [...prevMonthDates, ...currentMonthDates, ...nextMonthDates];
}
