/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */

/* eslint-disable @typescript-eslint/camelcase */
import {
  extendMonthDMToScheduleDM,
  MonthDataModel,
  ScheduleDataModel,
} from "../../../../common-models/schedule-data.model";
import { RevisionType, ScheduleKey, ThunkFunction } from "../../../../api/persistance-store.model";
import { PERSISTENT_SCHEDULE_NAME, TEMPORARY_SCHEDULE_NAME } from "../../../app.reducer";
import { createActionName, ScheduleActionModel, ScheduleActionType } from "./schedule.actions";
import { WorkerInfoExtendedInterface } from "../../../../components/namestable/worker-edit.component";
import { LocalStorageProvider } from "../../../../api/local-storage-provider.model";
import _ from "lodash";
import { WorkerInfoModel } from "../../../../common-models/worker-info.model";
import { ActionModel } from "../../../models/action.model";

export class ScheduleDataActionCreator {
  static setScheduleFromScheduleDM(
    newSchedule: ScheduleDataModel,
    saveInDatabase = true
  ): ThunkFunction<ScheduleDataModel> {
    return async (dispatch, getState): Promise<void> => {
      const destinations = [PERSISTENT_SCHEDULE_NAME, TEMPORARY_SCHEDULE_NAME];
      if (saveInDatabase) {
        const { revision } = getState().actualState;
        await new LocalStorageProvider().saveSchedule(revision, newSchedule);
      }
      destinations.forEach((destination) => {
        const action = {
          type: createActionName(destination, ScheduleActionType.ADD_NEW),
          payload: newSchedule,
        };
        dispatch(action);
      });
    };
  }

  static setScheduleFromMonthDM(
    newMonth: MonthDataModel,
    saveInDatabase = true,
    revision?: RevisionType
  ): ThunkFunction<ScheduleDataModel> {
    return async (dispatch, getState): Promise<void> => {
      if (_.isNil(revision)) {
        revision = getState().actualState.revision;
      }
      const [prevMonth, nextMonth] = await new LocalStorageProvider().fetchOrCreateMonthNeighbours(
        newMonth,
        revision
      );
      const newSchedule = extendMonthDMToScheduleDM(prevMonth, newMonth, nextMonth);
      await this.setScheduleFromScheduleDM(newSchedule, saveInDatabase)(dispatch, getState);
    };
  }

  static setScheduleFromKeyIfExistsInDB(
    monthKey: ScheduleKey,
    revision?: RevisionType,
    baseMonthModel?: MonthDataModel
  ): ThunkFunction<ScheduleDataModel> {
    return async (dispatch, getState): Promise<void> => {
      let monthDataModel;
      if (_.isNil(revision)) {
        revision = getState().actualState.revision;
      }

      if (baseMonthModel) {
        monthDataModel = await new LocalStorageProvider().fetchOrCreateMonthRevision(
          monthKey,
          revision,
          baseMonthModel
        );
      } else {
        monthDataModel = await new LocalStorageProvider().getMonthRevision(
          monthKey.getRevisionKey(revision)
        );
      }

      if (!_.isNil(monthDataModel)) {
        dispatch(this.setScheduleFromMonthDM(monthDataModel, false, revision));
      }
    };
  }

  static updateSchedule(newScheduleModel: ScheduleDataModel): ScheduleActionModel {
    return {
      type: createActionName(TEMPORARY_SCHEDULE_NAME, ScheduleActionType.UPDATE),
      payload: newScheduleModel,
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

  static deleteWorker(worker: WorkerInfoModel | undefined): (dispatch) => Promise<void> {
    return async (dispatch): Promise<void> => {
      const action = {
        type: ScheduleActionType.DELETE_WORKER,
        payload: { workerName: worker?.name },
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

  static cleanErrors(): ActionModel<unknown> {
    const action = {
      type: ScheduleActionType.CLEAN_ERRORS,
    };
    return action;
  }
}
