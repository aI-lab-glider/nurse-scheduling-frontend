/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
/* eslint-disable @typescript-eslint/camelcase */
import * as _ from "lodash";
import { ScheduleKey, ThunkFunction } from "../../../../api/persistance-store.model";
import { MonthInfoModel } from "../../../../common-models/month-info.model";
import { ScheduleDataModel } from "../../../../common-models/schedule-data.model";
import {
  PERSISTENT_SCHEDULE_NAME,
  ScheduleActionDestination,
  TEMPORARY_SCHEDULE_NAME,
} from "../../../app.reducer";
import { HistoryStateModel, MonthStateModel } from "../../../models/application-state.model";
import { HistoryReducerActionCreator } from "../../history.reducer";
import { cropMonthInfoToMonth, cropShiftsToMonth } from "./common-reducers";
import { createActionName, ScheduleActionModel, ScheduleActionType } from "./schedule.actions";

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

  static copyPreviousMonth(): ThunkFunction<ScheduleKey | MonthStateModel> {
    return (dispatch, getState): void => {
      const actualSchedule = getState().actualState;
      const historyAction = HistoryReducerActionCreator.addToHistory(actualSchedule);
      const destinations = [PERSISTENT_SCHEDULE_NAME, TEMPORARY_SCHEDULE_NAME];
      const {
        month_number: currentMonth = 0,
        year = new Date().getFullYear(),
      } = actualSchedule.temporarySchedule.present.schedule_info;
      destinations.forEach((destination) => {
        const action = {
          type: createActionName(destination, ScheduleActionType.COPY_TO_MONTH),
          payload: {
            month: (currentMonth + 1) % 12,
            year: currentMonth === 11 ? year + 1 : year,
          },
        };
        dispatch(action);
      });
      dispatch(historyAction);
    };
  }

  static addNewSchedule(
    destination: ScheduleActionDestination,
    newSchedule: ScheduleDataModel
  ): ThunkFunction<ScheduleDataModel> {
    return (dispatch, getState): void => {
      const history = getState().history;
      const [prevMonth, nextMonth] = getSurroundingMonths(getScheduleKey(newSchedule), history);
      const extendedSchedule = preprocessSchedule(prevMonth, newSchedule, nextMonth);
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
): [ScheduleDataModel, ScheduleDataModel] {
  // get schedule from history

  // if not avaiable get one/both from db
  // if not avaible create one/both
  // add new schedule to db/
  // add new scheudle to history
  return [history[0].schedule, history[1].schedule];
}

function preprocessSchedule(
  prevMonthSchedule: ScheduleDataModel,
  currentSchedule: ScheduleDataModel,
  nextMonthSchedule: ScheduleDataModel
): ScheduleDataModel {
  const croppedSchedule = cropToFullMonth(currentSchedule);
  const {
    month_number: monthNumber = new Date().getMonth(),
    year = new Date().getFullYear(),
  } = currentSchedule.schedule_info;
  const [missingFromPrev, missingFromNext] = calculateMissingFullWeekDays(monthNumber, year);
  const extendedSchedule = _.cloneDeep(croppedSchedule);
  const extendSchedule = <T>(sectionKey: string, valueKey: string): T[] =>
    extend<T>(
      prevMonthSchedule[sectionKey][valueKey],
      missingFromPrev,
      currentSchedule[sectionKey][valueKey],
      nextMonthSchedule[sectionKey][valueKey],
      missingFromNext
    );
  Object.keys(extendedSchedule.shifts).forEach((key) => {
    extendedSchedule.shifts[key] = extendSchedule("shifts", key);
  });
  const copiedInfo: MonthInfoModel = {
    children_number: extendSchedule("month_info", "children_number"),
    extra_workers: extendSchedule("month_info", "extra_workers"),
    dates: extendSchedule("month_info", "dates"),
    frozen_shifts: [],
  };
  extendedSchedule.month_info = copiedInfo;
  return extendedSchedule;
}

function extend<T>(arr1: T[], count1: number, curr: T[], arr2: T[], count2: number): T[] {
  return [...arr1.slice(arr1.length - count1), ...curr, ...arr2.slice(count2)];
}

export function calculateMissingFullWeekDays(monthNumber: number, year: number): [number, number] {
  const firstMonthDay = new Date(year, monthNumber, 1).getDay();
  const lastMonthDay = new Date(year, monthNumber + 1, 0).getDay();
  return [firstMonthDay === 0 ? 0 : firstMonthDay - 1, lastMonthDay === 0 ? 0 : 7 - lastMonthDay];
}

function cropToFullMonth(schedule: Required<ScheduleDataModel>): ScheduleDataModel {
  const croppedSchedule: ScheduleDataModel = _.cloneDeep(schedule);
  const { dates } = croppedSchedule.month_info;
  const {
    month_number: monthNumber = new Date().getMonth(),
    year = new Date().getFullYear(),
  } = schedule.schedule_info;
  const monthStart = dates.findIndex((v) => v === 1);
  croppedSchedule.shifts = cropShiftsToMonth(monthNumber, year, croppedSchedule.shifts, monthStart);
  croppedSchedule.month_info = cropMonthInfoToMonth(
    monthNumber,
    year,
    croppedSchedule.month_info,
    monthStart
  );
  return croppedSchedule;
}

function getScheduleKey(newSchedule: ScheduleDataModel): ScheduleKey {
  return {
    month: newSchedule.schedule_info.month_number ?? new Date().getMonth(),
    year: newSchedule.schedule_info.year ?? new Date().getFullYear(),
  };
}
