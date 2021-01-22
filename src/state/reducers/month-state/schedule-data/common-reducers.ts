/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */

/* eslint-disable @typescript-eslint/camelcase */
import * as _ from "lodash";
import { MonthInfoModel } from "../../../../common-models/month-info.model";
import { ShiftCode, ShiftInfoModel } from "../../../../common-models/shift-info.model";
import { ScheduleKey } from "../../../../api/persistance-store.model";

export function daysInMonth(month = 0, year = 0): number[] {
  const dayCount = new Date(year, month + 1, 0).getDate();
  return _.range(1, dayCount + 1);
}

export function cropShiftsToMonth(
  scheduleKey: ScheduleKey,
  shifts: ShiftInfoModel,
  startFromIndex = 0
): ShiftInfoModel {
  const { month, year } = scheduleKey;
  const days = daysInMonth(month, year).length;
  const copiedShifts = _.cloneDeep(shifts);
  Object.keys(copiedShifts).forEach((key) => {
    copiedShifts[key] = copiedShifts[key].slice(startFromIndex, startFromIndex + days);
  });
  return copiedShifts;
}

export function copyShiftsToMonth(
  scheduleKey: ScheduleKey,
  shifts: ShiftInfoModel,
  dates: number[]
): ShiftInfoModel {
  const { month, year } = scheduleKey;
  const days = daysInMonth(month, year).length;

  const copiedShifts = _.cloneDeep(shifts);
  const firstDay = dates.indexOf(1);
  let firstMonday = 0;
  for (let index = firstDay; index < dates.length; index++) {
    const day = dates[index];
    const prevMonth = getDateWithMonthOffset(month, year, -1).getMonth();
    const dayOfWeek = new Date(year, prevMonth, day).getDay();
    if (dayOfWeek === 1) {
      firstMonday = index;
      break;
    }
  }

  Object.keys(copiedShifts).forEach((key) => {
    const values = copiedShifts[key].slice(0, days);
    copiedShifts[key] = values.map((shift) =>
      [ShiftCode.L4, ShiftCode.U, ShiftCode.K].includes(shift) ? ShiftCode.W : shift
    );
  });

  const copiedWeek: ShiftInfoModel = {};
  Object.keys(copiedShifts).forEach((key) => {
    copiedWeek[key] = copiedShifts[key].slice(firstMonday, firstMonday + 7);
  });

  Object.keys(copiedShifts).forEach((key) => {
    const shifts = copiedShifts[key];
    let index = 0;
    shifts.forEach(() => {
      const dayofWeek = new Date(year, month, index).getDay();
      shifts[index] = copiedWeek[key][dayofWeek];
      index += 1;
    });
    copiedShifts[key] = shifts;
  });

  Object.keys(copiedShifts).forEach((key) => {
    const monthsLengthDiff = days - shifts[key].length;
    if (monthsLengthDiff > 0) {
      for (let i = 0; i < monthsLengthDiff; i++) {
        copiedShifts[key].push(ShiftCode.W);
      }
    }
  });

  return copiedShifts;
}
export function cropMonthInfoToMonth(
  scheduleKey: ScheduleKey,
  monthInfo: MonthInfoModel,
  startFromIndex = 0
): MonthInfoModel {
  const { month, year } = scheduleKey;
  const days = daysInMonth(month, year);
  return {
    children_number: monthInfo.children_number?.slice(startFromIndex, startFromIndex + days.length),
    extra_workers: monthInfo.extra_workers?.slice(startFromIndex, startFromIndex + days.length),
    dates: days,
    frozen_shifts: [],
  };
}

export function calculateMissingFullWeekDays({ month, year }: ScheduleKey): [number, number] {
  const firstMonthDay = new Date(year, month, 1).getDay();
  const lastMonthDay = new Date(year, month + 1, 0).getDay();
  return [firstMonthDay === 0 ? 0 : firstMonthDay - 1, lastMonthDay === 0 ? 0 : 7 - lastMonthDay];
}

export function getDateWithMonthOffset(month: number, year: number, offset: number): Date {
  const curDate = new Date(year, month);
  curDate.setMonth(curDate.getMonth() + offset);
  return curDate;
}
