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
import { ScheduleKey, ThunkFunction } from "../../../../api/persistance-store.model";
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

  static setScheduleFromMonthDM(newMonth: MonthDataModel): ThunkFunction<ScheduleDataModel> {
    return async (dispatch, getState): Promise<void> => {
      const history = getState().history;
      const [prevMonth, nextMonth] = await getMonthNeighbours(newMonth, history);
      const newSchedule = extendMonthDMToScheduleDM(prevMonth, newMonth, nextMonth);

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

  static setScheduleFromKeyIfExists(monthKey: ScheduleKey): ThunkFunction<ScheduleDataModel> {
    return async (dispatch, getState): Promise<void> => {
      const history = getState().history;
      const monthDataModel = await fetchMonthDM(monthKey, history);
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
  history: HistoryStateModel
): Promise<[MonthDataModel, MonthDataModel]> {
  const scheduleKey = new ScheduleKey(month.scheduleKey.month, month.scheduleKey.year);
  return [
    await fetchOrCreateMonthDM(scheduleKey.prevMonthKey, history, month),
    await fetchOrCreateMonthDM(scheduleKey.nextMonthKey, history, month),
  ];
}

export async function fetchOrCreateMonthDM(
  monthKey: ScheduleKey,
  history: HistoryStateModel,
  baseMonth: MonthDataModel
): Promise<MonthDataModel> {
  let monthDataModel = await fetchMonthDM(monthKey, history);
  if (_.isNil(monthDataModel)) {
    const storageProvider = new LocalStorageProvider();
    monthDataModel = createEmptyMonthDataModel(monthKey, baseMonth);
    await storageProvider.saveMonthRevision("actual", monthDataModel);
  }
  return monthDataModel;
}

export async function fetchMonthDM(
  monthKey: ScheduleKey,
  history: HistoryStateModel
): Promise<MonthDataModel | undefined> {
  let monthDataModel: MonthDataModel | undefined = history[monthKey.key];

  if (_.isNil(monthDataModel)) {
    const storageProvider = new LocalStorageProvider();
    monthDataModel = await storageProvider.getMonthRevision({
      revisionType: "actual",
      validityPeriod: monthKey.key,
    });
  }
  return monthDataModel;
}
