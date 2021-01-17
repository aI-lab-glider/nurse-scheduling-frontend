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
    const values = copiedShifts[key].slice(startFromIndex, startFromIndex + days);
    copiedShifts[key] = values.map((shift) =>
      [ShiftCode.L4, ShiftCode.U, ShiftCode.K].includes(shift) ? ShiftCode.W : shift
    );
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
