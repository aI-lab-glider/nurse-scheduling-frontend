/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */

import { ScheduleKey } from "../api/persistance-store.model";
import * as _ from "lodash";

export const NUMBER_OF_DAYS_IN_WEEK = 7;

export class MonthHelper {
  static getMonthLastWeekData<T>(
    scheduleKey: ScheduleKey,
    monthData: T[],
    nextMonthData: T[]
  ): T[] {
    const [, missingFromNextMonth] = this.calculateMissingFullWeekDays(scheduleKey);
    const monthLen = monthData.length;
    let lastWeek: T[] = [];
    if (missingFromNextMonth > 0) {
      const daysFromCurrentMonthInLastWeek = NUMBER_OF_DAYS_IN_WEEK - missingFromNextMonth;
      const currentMonthDataPart = monthData.slice(
        monthLen - daysFromCurrentMonthInLastWeek,
        monthLen + 1
      );
      const nextMonthDataPart = nextMonthData.slice(0, missingFromNextMonth);
      lastWeek = [...currentMonthDataPart, ...nextMonthDataPart];
    } else {
      lastWeek = monthData.slice(monthLen - NUMBER_OF_DAYS_IN_WEEK, monthLen + 1);
    }

    if (lastWeek.length !== NUMBER_OF_DAYS_IN_WEEK) {
      throw new Error(`Week must have ${NUMBER_OF_DAYS_IN_WEEK} days`);
    }

    return lastWeek;
  }

  static getMonthLength(year: number, month: number): number {
    return new Date(year, month + 1, 0).getDate();
  }

  static getMonthFullWeeksDaysLen(year: number, month: number): number {
    const [missingFromPrevMonth, missingFromNextMonth] = this.calculateMissingFullWeekDays(
      new ScheduleKey(month, year)
    );
    let numberOfWeekInMonth = this.numberOfWeeksInMonth(month, year);
    missingFromPrevMonth > 0 && numberOfWeekInMonth--;
    missingFromNextMonth > 0 && numberOfWeekInMonth--;
    return NUMBER_OF_DAYS_IN_WEEK * numberOfWeekInMonth;
  }

  static findFirstMonthMondayIdx(year: number, month: number): number {
    return _.findIndex(
      _.range(1, 1 + NUMBER_OF_DAYS_IN_WEEK).map((day, idx) => {
        return {
          weekDay: new Date(year, month, day).getDay(),
          idx,
        };
      }),
      (day) => day.weekDay === 1
    );
  }

  static daysInMonth(month = 0, year = 0): number[] {
    return _.range(1, this.getMonthLength(year, month) + 1);
  }

  static getDateWithMonthOffset(month: number, year: number, offset: number): Date {
    const curDate = new Date(year, month);
    curDate.setMonth(curDate.getMonth() + offset);
    return curDate;
  }

  static calculateMissingFullWeekDays({ month, year }: ScheduleKey): [number, number] {
    const firstMonthDay = new Date(year, month, 1).getDay();
    const lastMonthDay = new Date(year, month + 1, 0).getDay();
    return [firstMonthDay === 0 ? 6 : firstMonthDay - 1, lastMonthDay === 0 ? 0 : 7 - lastMonthDay];
  }

  static numberOfWeeksInMonth(month: number, year: number): number {
    const [missingPrev, missingNext] = MonthHelper.calculateMissingFullWeekDays(
      new ScheduleKey(month, year)
    );
    const monthLength = MonthHelper.daysInMonth(month, year).length;
    const fullScheduleDays = missingPrev + monthLength + missingNext;

    return fullScheduleDays / NUMBER_OF_DAYS_IN_WEEK;
  }
}
