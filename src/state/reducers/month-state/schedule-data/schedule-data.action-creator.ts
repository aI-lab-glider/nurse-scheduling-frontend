/* eslint-disable @typescript-eslint/camelcase */
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
import { createMonthKey } from "../../history.reducer";
import { getDateWithMonthOffset } from "./common-reducers";
import { createActionName, ScheduleActionModel, ScheduleActionType } from "./schedule.actions";
import { WorkerInfoExtendedInterface } from "../../../../components/namestable/worker-edit.component";

export interface CopyMonthActionPayload extends ScheduleKey {
  scheduleData: ScheduleDataModel;
}

export class ScheduleDataActionCreator {
  static setSchedule(newSchedule: ScheduleDataModel): ThunkFunction<ScheduleDataModel> {
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

  static copyMonth(offset: number): ThunkFunction<unknown> {
    return async (dispatch, getState): Promise<void> => {
      const {
        month_number,
        year,
      } = getState().actualState.persistentSchedule.present.schedule_info;
      if (month_number === undefined || year === undefined) return;
      const date = getDateWithMonthOffset(month_number, year, offset);
      dispatch(
        ScheduleDataActionCreator.copyFromMonth(
          date.getMonth(),
          date.getFullYear(),
          month_number,
          year
        )
      );
    };
  }

  static copyFromMonth(
    month: number,
    year: number,
    toMonth: number,
    toYear: number
  ): ThunkFunction<CopyMonthActionPayload | MonthStateModel> {
    return async (dispatch, getState): Promise<void> => {
      const copyingSchedule = getState().history[createMonthKey(month, year)].persistentSchedule
        .present;
      const destinations = [PERSISTENT_SCHEDULE_NAME, TEMPORARY_SCHEDULE_NAME];
      destinations.forEach((destination) => {
        const action = {
          type: createActionName(destination, ScheduleActionType.COPY_TO_MONTH),
          payload: {
            month: toMonth,
            year: toYear,
            scheduleData: copyingSchedule,
          },
        };
        dispatch(action);
      });
    };
  }

  static addNewWorker(worker: WorkerInfoExtendedInterface): (dispatch) => Promise<void> {
    return async (dispatch): Promise<void> => {
      const action = {
        type: ScheduleActionType.ADD_NEW_WORKER,
        payload: { ...worker },
      };
      dispatch(action);
    };
  }

  static modifyWorker(worker: WorkerInfoExtendedInterface): (dispatch) => Promise<void> {
    return async (dispatch): Promise<void> => {
      const action = {
        type: ScheduleActionType.MODIFY_WORKER,
        payload: { ...worker },
      };
      dispatch(action);
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
