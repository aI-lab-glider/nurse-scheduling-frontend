/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import { ScheduleKey } from "../api/persistance-store.model";
import * as _ from "lodash";
import { MonthHelper } from "../helpers/month.helper";

export interface ScheduleMetadata {
  UUID?: string;
  month_number: number;
  year: number;
}

export function validateScheduleInfo(scheduleInfo: ScheduleMetadata): void {
  if (scheduleInfo.month_number < 0 || scheduleInfo.month_number > 11) {
    throw new Error(`Month number has to be within range 0-11 not ${scheduleInfo.month_number}`);
  }

  if (scheduleInfo.year < 2000 || scheduleInfo.year > 2100) {
    throw new Error(`Year has to be within range 2000-2100 not ${scheduleInfo.year}`);
  }
}

export function createDatesForMonth(year: number, month: number): number[] {
  const [missingFromPrevMonth, missingFromNextMonth] = MonthHelper.calculateMissingFullWeekDays(
    new ScheduleKey(month, year)
  );
  const prevMonthKey = new ScheduleKey(month, year).prevMonthKey;
  const prevMonthLength = MonthHelper.getMonthLength(prevMonthKey.year, prevMonthKey.month);
  const prevMonthDates = _.range(prevMonthLength - missingFromPrevMonth + 1, prevMonthLength + 1);

  const currentMonthDates = MonthHelper.daysInMonth(month, year);
  const nextMonthDates = _.range(1, missingFromNextMonth + 1);

  return [...prevMonthDates, ...currentMonthDates, ...nextMonthDates];
}
