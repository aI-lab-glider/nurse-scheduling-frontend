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

import { HistoryStateModel } from "../../../models/application-state.model";
import { LocalStorageProvider } from "../../../../api/local-storage-provider.model";
import _ from "lodash";

export class ScheduleDataActionCreator {
  static setScheduleFromScheduleDM(
    newSchedule: ScheduleDataModel
  ): ThunkFunction<ScheduleDataModel> {
    return async (dispatch, getState): Promise<void> => {
      const destinations = [PERSISTENT_SCHEDULE_NAME, TEMPORARY_SCHEDULE_NAME];
      const { revision } = getState().actualState;
      await new LocalStorageProvider().saveSchedule(revision, newSchedule);
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
    revision?: RevisionType
  ): ThunkFunction<ScheduleDataModel> {
    return async (dispatch, getState): Promise<void> => {
      const history = getState().history;
      if (_.isNil(revision)) {
        revision = getState().actualState.revision;
      }
      const [prevMonth, nextMonth] = await getMonthNeighbours(newMonth, history, revision);
      const newSchedule = extendMonthDMToScheduleDM(prevMonth, newMonth, nextMonth);
      await this.setScheduleFromScheduleDM(newSchedule)(dispatch, getState);
    };
  }

  static setScheduleFromKeyIfExists(monthKey: ScheduleKey): ThunkFunction<ScheduleDataModel> {
    return async (dispatch, getState): Promise<void> => {
      const { history } = getState();
      const { revision } = getState().actualState;
      const monthDataModel = await fetchMonthDM(monthKey, history, revision);
      if (!_.isNil(monthDataModel)) {
        dispatch(this.setScheduleFromMonthDM(monthDataModel));
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
  history: HistoryStateModel,
  revision: RevisionType
): Promise<[MonthDataModel, MonthDataModel]> {
  const scheduleKey = new ScheduleKey(month.scheduleKey.month, month.scheduleKey.year);
  return [
    await fetchOrCreateMonthDM(scheduleKey.prevMonthKey, history, month, revision),
    await fetchOrCreateMonthDM(scheduleKey.nextMonthKey, history, month, revision),
  ];
}

export async function fetchOrCreateMonthDM(
  monthKey: ScheduleKey,
  history: HistoryStateModel,
  baseMonth: MonthDataModel,
  revision: RevisionType
): Promise<MonthDataModel> {
  let monthDataModel = await fetchMonthDM(monthKey, history, revision);
  if (_.isNil(monthDataModel)) {
    const storageProvider = new LocalStorageProvider();
    monthDataModel = createEmptyMonthDataModel(monthKey, baseMonth);
    await storageProvider.saveMonthRevision(revision, monthDataModel);
  }
  return monthDataModel;
}

export async function fetchMonthDM(
  monthKey: ScheduleKey,
  history: HistoryStateModel,
  revision: RevisionType
): Promise<MonthDataModel | undefined> {
  let monthDataModel: MonthDataModel | undefined = history[monthKey.dbKey];

  if (_.isNil(monthDataModel)) {
    const storageProvider = new LocalStorageProvider();
    monthDataModel = await storageProvider.getMonthRevision({
      revisionType: revision,
      validityPeriod: monthKey.dbKey,
    });
  }
  return monthDataModel;
}
