/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */

/* eslint-disable @typescript-eslint/camelcase */

import { ScheduleKey, ThunkFunction } from "../../../../api/persistance-store.model";
import { ScheduleDataActionCreator } from "./schedule-data.action-creator";
import { LocalStorageProvider } from "../../../../api/local-storage-provider.model";
import { RevisionReducerAction } from "../revision-info.reducer";
import { VerboseDateHelper } from "../../../../helpers/verbose-date.helper";
import { copyMonthDM } from "../../../../logic/month-copy/month-copy.logic";
import { MonthHelper } from "../../../../helpers/month.helper";
import { cropScheduleDMToMonthDM } from "../../../../logic/schedule-container-convertion/schedule-container-convertion";
import { UndoActionCreator } from "../../undoable.action-creator";
import {
  PERSISTENT_SCHEDULE_UNDOABLE_CONFIG,
  TEMPORARY_SCHEDULE_UNDOABLE_CONFIG,
} from "./schedule.actions";

const PREV_MONTH_OFFSET = -1;

export class MonthSwitchActionCreator {
  static switchToNewMonth(offset: number): ThunkFunction<unknown> {
    return async (dispatch, getState): Promise<void> => {
      const actualSchedule = getState().actualState.persistentSchedule.present;
      const actualMonthDM = cropScheduleDMToMonthDM(actualSchedule);
      const { month, year } = actualMonthDM.scheduleKey;

      const newDate = MonthHelper.getDateWithMonthOffset(month, year, offset);
      const newYear = newDate.getFullYear();
      const newMonth = newDate.getMonth();
      const newMonthKey = new ScheduleKey(newDate.getMonth(), newDate.getFullYear());

      // Set default revision type - primary in future, actual for present and past
      const { revision } = getState().actualState;
      const isFuture = VerboseDateHelper.isMonthInFuture(newMonth, newYear);
      const newRevisionType = isFuture ? "primary" : "actual";
      if (revision !== newRevisionType) {
        dispatch({
          type: RevisionReducerAction.CHANGE_REVISION,
          payload: newRevisionType,
        });
      }

      const addNewScheduleAction = ScheduleDataActionCreator.setScheduleStateAndCreateIfNeeded(
        newMonthKey,
        actualMonthDM,
        newRevisionType
      );
      dispatch(addNewScheduleAction);
      dispatch(UndoActionCreator.clearHistory(PERSISTENT_SCHEDULE_UNDOABLE_CONFIG));
      dispatch(UndoActionCreator.clearHistory(TEMPORARY_SCHEDULE_UNDOABLE_CONFIG));
    };
  }

  static copyFromPrevMonth(): ThunkFunction<unknown> {
    return async (dispatch, getState): Promise<void> => {
      const {
        month_number: month,
        year,
      } = getState().actualState.persistentSchedule.present.schedule_info;
      const fromDate = MonthHelper.getDateWithMonthOffset(month, year, PREV_MONTH_OFFSET);

      const baseSchedule = await new LocalStorageProvider().getMonthRevision(
        new ScheduleKey(fromDate.getMonth(), fromDate.getFullYear()).getRevisionKey("actual")
      );
      const newSchedule = await new LocalStorageProvider().getMonthRevision(
        new ScheduleKey(month, year).getRevisionKey("actual")
      );

      if (baseSchedule && newSchedule) {
        const scheduleDataModel = copyMonthDM(newSchedule, baseSchedule);
        dispatch(ScheduleDataActionCreator.setScheduleStateAndSaveToDb(scheduleDataModel));
      }
    };
  }
}
