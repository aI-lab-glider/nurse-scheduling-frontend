/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */

import { MonthHelper } from "../../helpers/month.helper";
import { ArrayHelper } from "../../helpers/array.helper";
import {
  ShiftCode,
  ShiftInfoModel,
  validateShiftInfoModel,
} from "../../common-models/shift-info.model";
import { MonthInfoModel, validateMonthInfo } from "../../common-models/month-info.model";
import {
  getScheduleKey,
  MonthDataModel,
  ScheduleContainerType,
  ScheduleDataModel,
  validateMonthDM,
  validateScheduleDM,
} from "../../common-models/schedule-data.model";
import { RevisionType, ScheduleKey } from "../../api/persistance-store.model";
import * as _ from "lodash";
import { LocalStorageProvider } from "../../api/local-storage-provider.model";

/* eslint-disable @typescript-eslint/camelcase */
export function extendMonthDMToScheduleDM(
  prevMonthData: MonthDataModel,
  currentMonthData: MonthDataModel,
  nextMonthData: MonthDataModel
): ScheduleDataModel {
  const { scheduleKey } = currentMonthData;
  const {
    daysMissingFromPrevMonth,
    daysMissingFromNextMonth,
  } = MonthHelper.calculateMissingFullWeekDays(scheduleKey);
  const extendSchedule = <T>(sectionKey: string, valueKey: string, defaultValue: T): T[] =>
    ArrayHelper.extend<T>(
      prevMonthData[sectionKey][valueKey],
      daysMissingFromPrevMonth,
      currentMonthData[sectionKey][valueKey],
      nextMonthData[sectionKey][valueKey],
      daysMissingFromNextMonth,
      defaultValue
    );

  const shifts: ShiftInfoModel = {};
  Object.keys(currentMonthData.shifts).forEach((key) => {
    shifts[key] = extendSchedule("shifts", key, ShiftCode.W);
  });

  const monthInfoModel: MonthInfoModel = {
    children_number: extendSchedule("month_info", "children_number", 0),
    extra_workers: extendSchedule("month_info", "extra_workers", 0),
    dates: extendSchedule("month_info", "dates", 0),
    frozen_shifts: [],
  };

  const scheduleDataModel = {
    ...currentMonthData,
    schedule_info: {
      UUID: "0",
      month_number: scheduleKey.month,
      year: scheduleKey.year,
    },
    month_info: monthInfoModel,
    shifts,
  };

  validateScheduleDM(scheduleDataModel);
  return scheduleDataModel;
}

export function cropScheduleDMToMonthDM(schedule: ScheduleDataModel): MonthDataModel {
  const { dates } = schedule.month_info;
  const monthStart = dates.findIndex((v) => v === 1);
  const monthKey = getScheduleKey(schedule);
  const shift = cropShiftsToMonth(monthKey, schedule.shifts, monthStart);
  const month = cropMonthInfoToMonth(monthKey, schedule.month_info, monthStart);

  const monthDataModel: MonthDataModel = {
    ...schedule,
    scheduleKey: monthKey,
    shifts: shift,
    month_info: month,
  };

  validateMonthDM(monthDataModel);
  return monthDataModel;
}

/* eslint-disable @typescript-eslint/camelcase */
export function cropShiftsToMonth(
  scheduleKey: ScheduleKey,
  shifts: ShiftInfoModel,
  startFromIndex = 0
): ShiftInfoModel {
  const { month, year } = scheduleKey;
  const days = MonthHelper.daysInMonth(month, year).length;
  const copiedShifts = _.cloneDeep(shifts);
  Object.keys(copiedShifts).forEach((key) => {
    copiedShifts[key] = copiedShifts[key].slice(startFromIndex, startFromIndex + days);
  });

  validateShiftInfoModel(copiedShifts, ScheduleContainerType.MONTH_DM);
  return copiedShifts;
}

export function cropMonthInfoToMonth(
  scheduleKey: ScheduleKey,
  monthInfo: MonthInfoModel,
  startFromIndex = 0
): MonthInfoModel {
  const { month, year } = scheduleKey;
  const days = MonthHelper.daysInMonth(month, year);

  const monthInfoModel = {
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

  validateMonthInfo(monthInfoModel, ScheduleContainerType.MONTH_DM);
  return monthInfoModel;
}

export async function extendMonthDMRevisionToScheduleDM(
  currentMonthData: MonthDataModel,
  revision: RevisionType
): Promise<ScheduleDataModel> {
  const [prevMonth, nextMonth] = await new LocalStorageProvider().fetchOrCreateMonthNeighbours(
    currentMonthData,
    revision
  );
  return extendMonthDMToScheduleDM(prevMonth, currentMonthData, nextMonth);
}
