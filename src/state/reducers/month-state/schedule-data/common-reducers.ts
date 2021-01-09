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
  while (month === date.getMonth()) {
    day++;
    date = new Date(year, month, day);
    result.push(day);
  }
  return result;
}
export function copyShiftstoMonth(
  month: number,
  year: number,
  shifts: ShiftInfoModel
): ShiftInfoModel {
  const days = daysInMonth(month, year).length;
  const copiedShifts = _.cloneDeep(shifts);
  Object.keys(copiedShifts).forEach((key) => {
    const values = copiedShifts[key].slice(0, days);
    copiedShifts[key] = values.map((shift) =>
      [ShiftCode.L4, ShiftCode.U, ShiftCode.K].includes(shift) ? ShiftCode.W : shift
    );
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
