/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */

/* eslint-disable @typescript-eslint/camelcase */
import {
  createEmptyMonthDataModel,
  getScheduleKey,
  MonthDataModel,
  ScheduleDataModel,
} from "../../../../common-models/schedule-data.model";
import { ScheduleKey, ThunkFunction } from "../../../../api/persistance-store.model";
import { PERSISTENT_SCHEDULE_NAME, TEMPORARY_SCHEDULE_NAME } from "../../../app.reducer";
import { createActionName, ScheduleActionModel, ScheduleActionType } from "./schedule.actions";
import { HistoryStateModel } from "../../../models/application-state.model";
import { HistoryReducerActionCreator } from "../../history.reducer";
import { ShiftInfoModel } from "../../../../common-models/shift-info.model";
import { MonthInfoModel } from "../../../../common-models/month-info.model";
import {
  calculateMissingFullWeekDays,
  cropMonthInfoToMonth,
  cropShiftsToMonth,
} from "./common-reducers";
import { LocalStorageProvider } from "../../../../api/local-storage-provider.model";
import _ from "lodash";

export class ScheduleDataActionCreator {
  static addScheduleDM(newSchedule: ScheduleDataModel): ThunkFunction<ScheduleDataModel> {
    return async (dispatch): Promise<void> => {
      const destinations = [PERSISTENT_SCHEDULE_NAME, TEMPORARY_SCHEDULE_NAME];
      await new LocalStorageProvider().saveSchedule("actual", newSchedule);
      destinations.forEach((destination) => {
        const action = {
          type: createActionName(destination, ScheduleActionType.ADD_NEW),
          payload: newSchedule,
        };
        dispatch(action);
      });
    };
  }

  static addScheduleFromMonthModel(newMonth: MonthDataModel): ThunkFunction<ScheduleDataModel> {
    return async (dispatch, getState): Promise<void> => {
      const history = getState().history;
      const [prevMonth, nextMonth] = await getSurroundingMonths(newMonth, history);
      const newSchedule = extendMonthToScheduleDM(prevMonth, newMonth, nextMonth);
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

  static addScheduleFromMonth(monthKey: ScheduleKey): ThunkFunction<ScheduleDataModel> {
    return async (dispatch, getState): Promise<void> => {
      const history = getState().history;
      let monthDataModel = history[monthKey.key];
      if (_.isNil(monthDataModel)) {
        const monthModel = await new LocalStorageProvider().getMonthRevision({
          revisionType: "actual",
          validityPeriod: monthKey.key,
        });
        if (!_.isNil(monthModel)) {
          monthDataModel = monthModel;
        }
      }
      if (!_.isNil(monthDataModel)) {
        this.addScheduleFromMonthModel(monthDataModel);
      }
    };
  }

  static copyPreviousMonth(): ThunkFunction<ScheduleKey | MonthDataModel> {
    return (dispatch, getState): void => {
      const actualSchedule = getState().actualState.persistentSchedule.present;
      const actualMonth = cropScheduleToMonthDM(actualSchedule);
      const historyAction = HistoryReducerActionCreator.addToMonthHistory(actualMonth);

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

  static updateSchedule(newScheduleModel: ScheduleDataModel): ScheduleActionModel {
    return {
      type: createActionName(TEMPORARY_SCHEDULE_NAME, ScheduleActionType.UPDATE),
      payload: newScheduleModel,
    };
  }
}

async function getSurroundingMonths(
  baseMonth: MonthDataModel,
  history: HistoryStateModel
): Promise<[MonthDataModel, MonthDataModel]> {
  return [
    await fetchOrCreateMonthDM(baseMonth.scheduleKey.prevMonthKey, history, baseMonth),
    await fetchOrCreateMonthDM(baseMonth.scheduleKey.nextMonthKey, history, baseMonth),
  ];
}

async function fetchOrCreateMonthDM(
  monthKey: ScheduleKey,
  history: HistoryStateModel,
  baseMonth: MonthDataModel
): Promise<MonthDataModel> {
  let monthDataModel = history[monthKey.key];
  if (_.isNil(monthDataModel)) {
    const storageProvider = new LocalStorageProvider();
    const newMonthDataModel = await storageProvider.getMonthRevision({
      revisionType: "actual",
      validityPeriod: monthKey.key,
    });

    if (_.isNil(newMonthDataModel)) {
      monthDataModel = createEmptyMonthDataModel(monthKey, baseMonth);
      await storageProvider.saveMonthRevision("actual", monthDataModel);
    } else {
      monthDataModel = newMonthDataModel;
    }
  }
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
    },
    month_info: monthInfoModel,
    employee_info: currentMonthData.employee_info,
    shifts,
  };
}

function extend<T>(arr1: T[], count1: number, curr: T[], arr2: T[], count2: number): T[] {
  return [...arr1.slice(arr1.length - count1), ...curr, ...arr2.slice(0, count2)];
}

export function cropScheduleToMonthDM(schedule: Required<ScheduleDataModel>): MonthDataModel {
  const { dates } = schedule.month_info;
  const monthStart = dates.findIndex((v) => v === 1);
  const monthKey = getScheduleKey(schedule);
  debugger;

  return {
    scheduleKey: monthKey,
    shifts: cropShiftsToMonth(monthKey, schedule.shifts, monthStart),
    month_info: cropMonthInfoToMonth(monthKey, schedule.month_info, monthStart),
    employee_info: schedule.employee_info,
  };
}
