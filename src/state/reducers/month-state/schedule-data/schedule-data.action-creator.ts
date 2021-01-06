/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import { ScheduleKey, ThunkFunction } from "../../../../api/persistance-store.model";
import { ScheduleDataModel } from "../../../../common-models/schedule-data.model";
import {
  PERSISTENT_SCHEDULE_NAME,
  ScheduleActionDestination,
  TEMPORARY_SCHEDULE_NAME,
} from "../../../app.reducer";
import { MonthStateModel } from "../../../models/application-state.model";
import { HistoryReducerActionCreator } from "../../history.reducer";
import { createActionName, ScheduleActionModel, ScheduleActionType } from "./schedule.actions";

export class ScheduleDataActionCreator {
  static setPersistentSchedule(newSchedule: ScheduleDataModel): ThunkFunction<ScheduleDataModel> {
    return async (dispatch): Promise<void> => {
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
    return async (dispatch, getState): Promise<void> => {
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
  ): ScheduleActionModel {
    return {
      type: createActionName(destination, ScheduleActionType.ADD_NEW),
      payload: newSchedule,
    };
  }

  static updateSchedule(newScheduleModel: ScheduleDataModel): ScheduleActionModel {
    return {
      type: createActionName(TEMPORARY_SCHEDULE_NAME, ScheduleActionType.UPDATE),
      payload: newScheduleModel,
    };
  }
}
