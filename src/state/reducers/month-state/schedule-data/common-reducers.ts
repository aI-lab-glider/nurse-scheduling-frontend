/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */

import * as _ from "lodash";
import { MonthInfoModel } from "../../../../common-models/month-info.model";
import { ShiftInfoModel } from "../../../../common-models/shift-info.model";
import { ScheduleKey } from "../../../../api/persistance-store.model";
import { ArrayHelper } from "../../../../helpers/array.helper";
import { MonthHelper } from "../../../../helpers/month.helper";

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
  return copiedShifts;
}

export function cropMonthInfoToMonth(
  scheduleKey: ScheduleKey,
  monthInfo: MonthInfoModel,
  startFromIndex = 0
): MonthInfoModel {
  const { month, year } = scheduleKey;
  const days = MonthHelper.daysInMonth(month, year);
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
