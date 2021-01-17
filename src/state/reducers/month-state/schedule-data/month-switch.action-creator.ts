/* eslint-disable @typescript-eslint/camelcase */

/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import { ThunkFunction } from "../../../../api/persistance-store.model";
import { scheduleDataInitialState } from "./schedule-data-initial-state";
import { ScheduleDataActionCreator } from "./schedule-data.action-creator";
import * as _ from "lodash";
import { createMonthKey, HistoryReducerActionCreator } from "../../history.reducer";
import { getDateWithMonthOffset } from "./common-reducers";

export class MonthSwitchActionCreator {
  static switchToNewMonth(offset: number): ThunkFunction<unknown> {
    return async (dispatch, getState): Promise<void> => {
      const history = getState().history;
      const actualSchedule = getState().actualState;
      const year =
        actualSchedule.persistentSchedule.present.schedule_info.year ?? new Date().getFullYear();
      const month = actualSchedule.persistentSchedule.present.schedule_info.month_number ?? 0;

      const historyAction = HistoryReducerActionCreator.addToHistory(actualSchedule);

      const newDate = getDateWithMonthOffset(month, year, offset);
      const nextSchedule = history[createMonthKey(newDate.getMonth(), newDate.getFullYear())];
      if (nextSchedule) {
        dispatch(ScheduleDataActionCreator.setSchedule(nextSchedule.persistentSchedule.present));
        if (!history[createMonthKey(month, year)]) {
          dispatch(historyAction);
        }

        return;
      }

      const newState = _.cloneDeep(scheduleDataInitialState);

      newState.schedule_info.month_number = newDate.getMonth();
      newState.schedule_info.year = newDate.getFullYear();

      const newPersistentScheduleAction = ScheduleDataActionCreator.addNewSchedule(
        "PERSISTENT",
        newState
      );
      const newTemporaryScheduleAction = ScheduleDataActionCreator.addNewSchedule(
        "TEMPORARY",
        newState
      );
      dispatch(historyAction);
      dispatch(newPersistentScheduleAction);
      dispatch(newTemporaryScheduleAction);
    };
  }
}
