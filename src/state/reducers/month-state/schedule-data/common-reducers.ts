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

export function copyShifts(
  { scheduleKey: currentScheduleKey, shifts: currentScheduleShifts }: MonthDataModel,
  baseShifts: ShiftInfoModel
): ShiftInfoModel {
  const { month: baseMonth, year: baseYear } = currentScheduleKey.prevMonthKey;

  const numberOfDaysToBeCopied = getNumberOfDaysToBeCopied(currentScheduleKey);

  const newMonthWorkersShifts: ShiftInfoModel = {};
  Object.keys(baseShifts).forEach((workerKey) => {
    const fullBaseMonthShifts = cropMonthDataToFullWeeks(
      baseYear,
      baseMonth,
      baseShifts[workerKey]
    );

    let missingShifts = ArrayHelper.circularExtendToLength(
      fullBaseMonthShifts,
      numberOfDaysToBeCopied
    );

    missingShifts = missingShifts.map((shift) => {
      return FREE_SHIFTS.includes(shift) ? ShiftCode.W : shift;
    });

    newMonthWorkersShifts[workerKey] = concatWithLastWeekFromPrevMonth(
      currentScheduleKey,
      missingShifts,
      currentScheduleShifts[workerKey] ?? []
    );
  });
  return newMonthWorkersShifts;
}

export function copyMonthInfo(
  { scheduleKey: currentScheduleKey, month_info: currentMonthInfo }: MonthDataModel,
  baseMonthInfo: MonthInfoModel
): MonthInfoModel {
  const dates = createDatesForMonth(currentScheduleKey.year, currentScheduleKey.month);
  return {
    children_number: copyMonthData(
      currentScheduleKey,
      currentMonthInfo.children_number ?? [],
      baseMonthInfo.children_number ?? []
    ),
    extra_workers: copyMonthData(
      currentScheduleKey,
      currentMonthInfo.extra_workers ?? [],
      baseMonthInfo.extra_workers ?? []
    ),
    dates,
    frozen_shifts: [],
  };
}

function copyMonthData<T>(monthKey: ScheduleKey, currentMonthData: T[], baseMonthData: T[]): T[] {
  const { month: baseMonth, year: baseYear } = monthKey.prevMonthKey;
  const numberOfDaysToBeCopied = getNumberOfDaysToBeCopied(monthKey);
  const copyBase = cropMonthDataToFullWeeks(baseYear, baseMonth, baseMonthData);

  const copiedData = ArrayHelper.circularExtendToLength(copyBase, numberOfDaysToBeCopied);
  return concatWithLastWeekFromPrevMonth(monthKey, copiedData, baseMonthData);
}

function concatWithLastWeekFromPrevMonth<T>(
  monthKey: ScheduleKey,
  copiedData: T[],
  baseData: T[]
): T[] {
  const prevMonthLastWeek = getMonthLastWeekData(monthKey, baseData, copiedData);
  return prevMonthLastWeek ? prevMonthLastWeek.concat(copiedData) : copiedData;
}

function getNumberOfDaysToBeCopied(monthKey: ScheduleKey): number {
  const [, daysEditedInPrevMonth] = calculateMissingFullWeekDays(monthKey.prevMonthKey);
  const [, daysFromNextMonth] = calculateMissingFullWeekDays(monthKey);

  return getMonthLength(monthKey.year, monthKey.month) - daysEditedInPrevMonth + daysFromNextMonth;
}

function cropMonthDataToFullWeeks<T>(year: number, month: number, monthData: T[]): T[] {
  const firstMonthMonday = findFirstMonthMondayIdx(year, month);
  return monthData.slice(
    firstMonthMonday,
    firstMonthMonday + getMonthFullWeeksDaysLen(year, month)
  );
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

function getMonthLength(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate();
}

function getMonthFullWeeksDaysLen(year: number, month: number): number {
  const [missingFromPrevMonth, missingFromNextMonth] = calculateMissingFullWeekDays(
    new ScheduleKey(month, year)
  );
  let numberOfWeekInMonth = numberOfWeeksInMonth(month, year);
  missingFromPrevMonth > 0 && numberOfWeekInMonth--;
  missingFromNextMonth > 0 && numberOfWeekInMonth--;
  return NUMBER_OF_DAYS_IN_WEEK * numberOfWeekInMonth;
}

function createDatesForMonth(year: number, month: number): number[] {
  const [missingFromPrevMonth, missingFromNextMonth] = calculateMissingFullWeekDays(
    new ScheduleKey(month, year)
  );
  const prevMonthKey = new ScheduleKey(month, year).prevMonthKey;
  const prevMonthLength = getMonthLength(prevMonthKey.year, prevMonthKey.month);
  const prevMonthDates = _.range(prevMonthLength - missingFromPrevMonth + 1, prevMonthLength + 1);

  const currentMonthDates = daysInMonth(month, year);
  const nextMonthDates = _.range(1, missingFromNextMonth + 1);

  return [...prevMonthDates, ...currentMonthDates, ...nextMonthDates];
}

function getMonthLastWeekData<T>(
  scheduleKey: ScheduleKey,
  monthData: T[],
  nextMonthData: T[]
): T[] {
  const [, missingFromNextMonth] = calculateMissingFullWeekDays(scheduleKey);
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
