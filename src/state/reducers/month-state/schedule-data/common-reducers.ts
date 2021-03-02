/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */

/* eslint-disable @typescript-eslint/camelcase */
import * as _ from "lodash";
import { MonthInfoModel } from "../../../../common-models/month-info.model";
import { FREE_SHIFTS, ShiftCode, ShiftInfoModel } from "../../../../common-models/shift-info.model";
import { ScheduleKey } from "../../../../api/persistance-store.model";
import { MonthDataModel } from "../../../../common-models/schedule-data.model";
import { ArrayHelper } from "../../../../helpers/array.helper";

const NUMBER_OF_DAYS_IN_WEEK = 7;

export function daysInMonth(month = 0, year = 0): number[] {
  return _.range(1, getMonthLength(year, month) + 1);
}

export function numberOfWeeksInMonth(month: number, year: number): number {
  const [missingPrev, missingNext] = calculateMissingFullWeekDays(new ScheduleKey(month, year));
  const monthLength = daysInMonth(month, year).length;
  const fullScheduleDays = missingPrev + monthLength + missingNext;

  return fullScheduleDays / NUMBER_OF_DAYS_IN_WEEK;
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
  { scheduleKey: currentScheduleKey, shifts: currentScheduleShifts }: MonthDataModel,
  { scheduleKey: baseScheduleKey, shifts: baseShifts }: MonthDataModel
): ShiftInfoModel {
  const currentCopiedShifts = _.cloneDeep(currentScheduleShifts);
  const baseCopiedShifts = _.cloneDeep(baseShifts);

  const { month, year } = currentScheduleKey;
  const { month: baseMonth, year: baseYear } = baseScheduleKey;

  const [, missingFromNextMonth] = calculateMissingFullWeekDays(baseScheduleKey);

  const newMonthWorkersShifts: ShiftInfoModel = {};
  Object.keys(baseCopiedShifts).forEach((workerKey) => {
    const missingShifts = fillWithShiftsFromBaseMonthFullWeeks(
      baseYear,
      baseMonth,
      baseCopiedShifts[workerKey],
      getMonthLength(year, month) - missingFromNextMonth
    );
    const baseMonthShifts = currentCopiedShifts[workerKey]?.slice(0, missingFromNextMonth) ?? [];
    newMonthWorkersShifts[workerKey] = baseMonthShifts
      ? baseMonthShifts.concat(missingShifts)
      : missingShifts;
  });
  return newMonthWorkersShifts;
}

export function cropMonthInfoToMonth(
  scheduleKey: ScheduleKey,
  monthInfo: MonthInfoModel,
  startFromIndex = 0
): MonthInfoModel {
  const { month, year } = scheduleKey;
  const days = daysInMonth(month, year);
  return {
    children_number: ArrayHelper.createArrayOfLengthFromArray(
      monthInfo.children_number ?? [],
      days.length,
      0,
      startFromIndex
    ),
    extra_workers: ArrayHelper.createArrayOfLengthFromArray(
      monthInfo.extra_workers ?? [],
      days.length,
      0,
      startFromIndex
    ),
    dates: days,
    frozen_shifts: [],
  };
}

export function calculateMissingFullWeekDays({ month, year }: ScheduleKey): [number, number] {
  const firstMonthDay = new Date(year, month, 1).getDay();
  const lastMonthDay = new Date(year, month + 1, 0).getDay();
  return [firstMonthDay === 0 ? 6 : firstMonthDay - 1, lastMonthDay === 0 ? 0 : 7 - lastMonthDay];
}

export function getDateWithMonthOffset(month: number, year: number, offset: number): Date {
  const curDate = new Date(year, month);
  curDate.setMonth(curDate.getMonth() + offset);
  return curDate;
}

function findFirstMonthMondayIdx(year: number, month: number): number {
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

function fillWithShiftsFromBaseMonthFullWeeks(
  baseYear: number,
  baseMonth: number,
  baseCopiedShifts: ShiftCode[],
  missingCurrentMonthDays
): ShiftCode[] {
  const firstMonthMonday = findFirstMonthMondayIdx(baseYear, baseMonth);
  const fullBaseMonthShifts = baseCopiedShifts.slice(
    firstMonthMonday,
    firstMonthMonday + getMonthFullWeeksDaysLen(baseYear, baseMonth)
  );

  const workerShifts: ShiftCode[] = [];
  let baseMonthShiftIter = 0;
  while (workerShifts.length !== missingCurrentMonthDays) {
    let shift = fullBaseMonthShifts[baseMonthShiftIter];
    if (FREE_SHIFTS.includes(shift)) {
      shift = ShiftCode.W;
    }
    workerShifts.push(shift);

    baseMonthShiftIter += 1;
    baseMonthShiftIter = baseMonthShiftIter % fullBaseMonthShifts.length;
  }
  return workerShifts;
}

function getMonthLength(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate();
}

function getMonthFullWeeksDaysLen(year: number, month: number): number {
  const [missingFromPrevMonth, missingFromNextMonth] = calculateMissingFullWeekDays(
    new ScheduleKey(year, month)
  );
  let numberOfWeekInMonth = numberOfWeeksInMonth(month, year);
  missingFromPrevMonth > 0 && numberOfWeekInMonth--;
  missingFromNextMonth > 0 && numberOfWeekInMonth--;
  return NUMBER_OF_DAYS_IN_WEEK * numberOfWeekInMonth;
}
