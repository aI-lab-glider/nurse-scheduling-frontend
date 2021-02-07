/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */

/* eslint-disable @typescript-eslint/camelcase */
import {
  createEmptyMonthDataModel,
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

export class ScheduleDataActionCreator {
  static setScheduleFromScheduleDM(
    newSchedule: ScheduleDataModel,
    saveInDatabase = true
  ): ThunkFunction<ScheduleDataModel> {
    return async (dispatch, getState): Promise<void> => {
      const destinations = [PERSISTENT_SCHEDULE_NAME, TEMPORARY_SCHEDULE_NAME];
      if (saveInDatabase) {
        const { revision } = getState().actualState;
        debugger;
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
      const [prevMonth, nextMonth] = await getMonthNeighbours(newMonth, revision);
      const newSchedule = extendMonthDMToScheduleDM(prevMonth, newMonth, nextMonth);
      debugger;
      await this.setScheduleFromScheduleDM(newSchedule, saveInDatabase)(dispatch, getState);
    };
  }

  static setScheduleFromKeyIfExists(monthKey: ScheduleKey): ThunkFunction<ScheduleDataModel> {
    return async (dispatch, getState): Promise<void> => {
      const { revision } = getState().actualState;
      const storageProvider = new LocalStorageProvider();
      const monthDataModel = await storageProvider.getMonthRevision(
        monthKey.getRevisionKey(revision)
      );
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

  static modifyWorker(worker: WorkerInfoExtendedInterface): (dispatch) => Promise<void> {
    return async (dispatch): Promise<void> => {
      const action = {
        type: ScheduleActionType.MODIFY_WORKER,
        payload: { ...worker },
      };
      dispatch(action);
    };
  }
}

async function getMonthNeighbours(
  month: MonthDataModel,
  revision: RevisionType
): Promise<[MonthDataModel, MonthDataModel]> {
  const scheduleKey = new ScheduleKey(month.scheduleKey.month, month.scheduleKey.year);
  return [
    await fetchOrCreateMonthDM(scheduleKey.prevMonthKey, revision, month),
    await fetchOrCreateMonthDM(scheduleKey.nextMonthKey, revision, month),
  ];
}

export async function fetchOrCreateMonthDM(
  monthKey: ScheduleKey,
  revision: RevisionType,
  baseMonth: MonthDataModel
): Promise<MonthDataModel> {
  const storageProvider = new LocalStorageProvider();
  let monthDataModel = await storageProvider.getMonthRevision(monthKey.getRevisionKey(revision));

  if (_.isNil(monthDataModel)) {
    const storageProvider = new LocalStorageProvider();
    monthDataModel = createEmptyMonthDataModel(monthKey, baseMonth);
    debugger;
    await storageProvider.checkAndSafeMonthRevisions(revision, monthDataModel);
  }
  return monthDataModel;
}
