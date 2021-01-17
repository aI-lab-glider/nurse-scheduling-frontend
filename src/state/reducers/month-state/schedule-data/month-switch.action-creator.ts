/* eslint-disable @typescript-eslint/camelcase */

/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import { ScheduleKey, ThunkFunction } from "../../../../api/persistance-store.model";
import { cropScheduleToMonthDM, ScheduleDataActionCreator } from "./schedule-data.action-creator";
import * as _ from "lodash";
import { HistoryReducerActionCreator } from "../../history.reducer";
import { cropMonthInfoToMonth, copyShiftsToMonth, getDateWithMonthOffset } from "./common-reducers";
import {
  createEmptyMonthDataModel,
  MonthDataModel,
} from "../../../../common-models/schedule-data.model";

export class MonthSwitchActionCreator {
  static switchToNewMonth(offset: number): ThunkFunction<unknown> {
    return async (dispatch, getState): Promise<void> => {
      const history = getState().history;
      const actualSchedule = getState().actualState.persistentSchedule.present;
      const year = actualSchedule.schedule_info.year;
      const month = actualSchedule.schedule_info.month_number;

      const historyAction = HistoryReducerActionCreator.addToMonthHistory(
        cropScheduleToMonthDM(actualSchedule)
      );
      dispatch(historyAction);

      // TODO: Fetch data from db
      const newDate = getDateWithMonthOffset(month, year, offset);
      const nextSchedule = history[new ScheduleKey(newDate.getMonth(), newDate.getFullYear()).key];
      if (nextSchedule) {
        dispatch(ScheduleDataActionCreator.addScheduleFromMonthModel(nextSchedule));
        return;
      }
      debugger;
      const monthDataModel = createEmptyMonthDataModel(
        new ScheduleKey(newDate.getMonth(), newDate.getFullYear()),
        {
          employee_info: actualSchedule.employee_info,
          shifts: actualSchedule.shifts,
        }
      );
      const newPersistentScheduleAction = ScheduleDataActionCreator.addScheduleFromMonthModel(
        monthDataModel
      );
      dispatch(newPersistentScheduleAction);
    };
  }

  static copyFromMonth(
    month: number,
    year: number,
    toMonth: number,
    toYear: number
  ): ThunkFunction<unknown> {
    return async (dispatch, getState): Promise<void> => {
      const copyingSchedule = getState().history[new ScheduleKey(month, year).key];

      const monthDataModel: MonthDataModel = {
        scheduleKey: new ScheduleKey(toMonth, toYear),
        shifts: copyShiftsToMonth(
          new ScheduleKey(month, year),
          copyingSchedule.shifts,
          copyingSchedule.month_info.dates
        ),
        month_info: cropMonthInfoToMonth(new ScheduleKey(month, year), copyingSchedule.month_info),
        employee_info: _.cloneDeep(copyingSchedule.employee_info),
      };
      dispatch(ScheduleDataActionCreator.addScheduleFromMonthModel(monthDataModel));
    };
  }

  static copyMonth(offset: number): ThunkFunction<unknown> {
    return async (dispatch, getState): Promise<void> => {
      const {
        month_number,
        year,
      } = getState().actualState.persistentSchedule.present.schedule_info;
      if (month_number === undefined || year === undefined) return;
      const date = getDateWithMonthOffset(month_number, year, offset);
      dispatch(
        MonthSwitchActionCreator.copyFromMonth(
          date.getMonth(),
          date.getFullYear(),
          month_number,
          year
        )
      );
    };
  }
}
