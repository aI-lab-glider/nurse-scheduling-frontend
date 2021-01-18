/* eslint-disable @typescript-eslint/camelcase */
/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */

import _ from "lodash";
import { MonthInfoModel } from "../../../../common-models/month-info.model";
import { ShiftCode, ShiftInfoModel } from "../../../../common-models/shift-info.model";

export function daysInMonth(month = 0, year = 0): number[] {
  let day = 1;
  const result = [day];
  let date = new Date(year, month, day);
  while (month === date.getMonth() && day < 31) {
    day++;
    date = new Date(year, month, day);
    result.push(day);
  }
  return result;
}
export function copyShiftstoMonth(
  month: number,
  year: number,
  shifts: ShiftInfoModel,
  dates: number[]
): ShiftInfoModel {
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
    const shifts = copiedShifts[key].slice(firstMonday, firstMonday + 7);
    copiedWeek[key] = shifts;
  });
  Object.keys(copiedShifts).forEach((key) => {
    const shifts = copiedShifts[key];
    let index = 0;
    shifts.forEach((element) => {
      const dayofWeek = new Date(year, month, index).getDay();
      shifts[index] = copiedWeek[key][dayofWeek];
      index += 1;
    });
    copiedShifts[key] = shifts;
  });

  return copiedShifts;
}

export function copyMonthInfo(
  month: number,
  year: number,
  monthInfo: MonthInfoModel
): MonthInfoModel {
  const days = daysInMonth(month, year);
  const copiedInfo: MonthInfoModel = {
    children_number: monthInfo.children_number?.slice(0, days.length),
    extra_workers: monthInfo.extra_workers?.slice(0, days.length),
    dates: days,
    frozen_shifts: [],
  };
  return copiedInfo;
}

export function getDateWithMonthOffset(month: number, year: number, offset: number): Date {
  const curDate = new Date(year, month);
  curDate.setMonth(curDate.getMonth() + offset);
  return curDate;
}
