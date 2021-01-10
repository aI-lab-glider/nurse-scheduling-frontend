/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */

/* eslint-disable @typescript-eslint/camelcase */

import {
  getScheduleKey,
  MonthDataModel,
  ScheduleDataModel,
} from "../../../../common-models/schedule-data.model";
import { ScheduleKey, ThunkFunction } from "../../../../api/persistance-store.model";
import {
  PERSISTENT_SCHEDULE_NAME,
  ScheduleActionDestination,
  TEMPORARY_SCHEDULE_NAME,
} from "../../../app.reducer";
import { createActionName, ScheduleActionModel, ScheduleActionType } from "./schedule.actions";
import { HistoryStateModel } from "../../../models/application-state.model";
import { HistoryReducerActionCreator } from "../../history.reducer";
import { ShiftInfoModel } from "../../../../common-models/shift-info.model";
import { MonthInfoModel } from "../../../../common-models/month-info.model";
import { cropMonthInfoToMonth, cropShiftsToMonth } from "./common-reducers";

export class ScheduleDataActionCreator {
  static setPersistentSchedule(newSchedule: ScheduleDataModel): ThunkFunction<ScheduleDataModel> {
    return (dispatch): void => {
      const destinations = [PERSISTENT_SCHEDULE_NAME, TEMPORARY_SCHEDULE_NAME];
      destinations.forEach((destination) => {
        const action = {
          type: createActionName(destination, ScheduleActionType.ADD_NEW),
          payload: newSchedule,
        };
        dispatch(action);
      });
    };
  }

  static copyPreviousMonth(): ThunkFunction<ScheduleKey | MonthDataModel> {
    return (dispatch, getState): void => {
      const actualSchedule = getState().actualState.persistentSchedule.present;
      const historyAction = HistoryReducerActionCreator.addToScheduleHistory(actualSchedule);
      const destinations = [PERSISTENT_SCHEDULE_NAME, TEMPORARY_SCHEDULE_NAME];
      const scheduleKey: ScheduleKey = getScheduleKey(actualSchedule);

      destinations.forEach((destination) => {
        const action = {
          type: createActionName(destination, ScheduleActionType.COPY_TO_MONTH),
          payload: scheduleKey.nextMonthKey,
        };
        dispatch(action);
      });
      dispatch(historyAction);
    };
  }

  static addNewSchedule(
    destination: ScheduleActionDestination,
    newSchedule: ScheduleDataModel
  ): ScheduleActionModel {
    return {
      type: createActionName(destination, ScheduleActionType.ADD_NEW),
      payload: newSchedule,
    };
  }

  static addNewScheduleFromMonth(
    destination: ScheduleActionDestination,
    newMonth: MonthDataModel
  ): ThunkFunction<ScheduleDataModel> {
    return (dispatch, getState): void => {
      const history = getState().history;
      const [prevMonth, nextMonth] = getSurroundingMonths(newMonth.scheduleKey, history);
      const extendedSchedule = extendMonthToScheduleDM(prevMonth, newMonth, nextMonth);
      const action = {
        type: createActionName(destination, ScheduleActionType.ADD_NEW),
        payload: extendedSchedule,
      };
      dispatch(action);
    };
  }

  static updateSchedule(newScheduleModel: ScheduleDataModel): ScheduleActionModel {
    return {
      type: createActionName(TEMPORARY_SCHEDULE_NAME, ScheduleActionType.UPDATE),
      payload: newScheduleModel,
    };
  }
}

function getSurroundingMonths(
  key: ScheduleKey,
  history: HistoryStateModel
): [MonthDataModel, MonthDataModel] {
  const prevMonth: MonthDataModel = getMonth(key.prevMonthKey, history);
  const nextMonth: MonthDataModel = getMonth(key.nextMonthKey, history);
  return [prevMonth, nextMonth];
}

function getMonth(monthKey: ScheduleKey, history: HistoryStateModel): MonthDataModel {
  const monthDataModel = history[monthKey.key];
  // get schedule from history
  // if not avaiable get one/both from db
  // if not avaible create one/both
  // add new schedule to db/
  // add new scheudle to history
  return monthDataModel;
}

function extendMonthToScheduleDM(
  prevMonthData: MonthDataModel,
  currentMonthData: MonthDataModel,
  nextMonthData: MonthDataModel
): ScheduleDataModel {
  const { scheduleKey } = currentMonthData;
  const [missingFromPrev, missingFromNext] = calculateMissingFullWeekDays(scheduleKey);

  const extendSchedule = <T>(sectionKey: string, valueKey: string): T[] =>
    extend<T>(
      prevMonthData[sectionKey][valueKey],
      missingFromPrev,
      currentMonthData[sectionKey][valueKey],
      nextMonthData[sectionKey][valueKey],
      missingFromNext
    );

  const shifts: ShiftInfoModel = {};
  Object.keys(currentMonthData.shifts).forEach((key) => {
    shifts[key] = extendSchedule("shifts", key);
  });

  const monthInfoModel: MonthInfoModel = {
    children_number: extendSchedule("month_info", "children_number"),
    extra_workers: extendSchedule("month_info", "extra_workers"),
    dates: extendSchedule("month_info", "dates"),
    frozen_shifts: [],
  };

  return {
    schedule_info: {
      UUID: "0",
      month_number: scheduleKey.month,
      year: scheduleKey.year,
      daysFromPreviousMonthExists: false,
    },
    month_info: monthInfoModel,
    employee_info: currentMonthData.employee_info,
    shifts,
  };
}

function extend<T>(arr1: T[], count1: number, curr: T[], arr2: T[], count2: number): T[] {
  return [...arr1.slice(arr1.length - count1), ...curr, ...arr2.slice(count2)];
}

export function calculateMissingFullWeekDays({ month, year }: ScheduleKey): [number, number] {
  const firstMonthDay = new Date(year, month, 1).getDay();
  const lastMonthDay = new Date(year, month + 1, 0).getDay();
  return [firstMonthDay === 0 ? 0 : firstMonthDay - 1, lastMonthDay === 0 ? 0 : 7 - lastMonthDay];
}

export function cropScheduleToMonthDM(schedule: Required<ScheduleDataModel>): MonthDataModel {
  const { dates } = schedule.month_info;
  const monthStart = dates.findIndex((v) => v === 1);
  const monthKey = getScheduleKey(schedule);

  return {
    scheduleKey: monthKey,
    shifts: cropShiftsToMonth(monthKey, schedule.shifts, monthStart),
    month_info: cropMonthInfoToMonth(monthKey, schedule.month_info, monthStart),
    employee_info: schedule.employee_info,
  };
}
