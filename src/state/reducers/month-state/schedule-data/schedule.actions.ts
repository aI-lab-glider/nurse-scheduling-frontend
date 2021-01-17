/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */

import _ from "lodash";
import { ThunkDispatch } from "redux-thunk";
import { LocalStorageProvider } from "../../../../api/local-storage-provider.model";
import { ScheduleDataModel } from "../../../../common-models/schedule-data.model";
import { TEMPORARY_SCHEDULE_NAME } from "../../../app.reducer";
import { ActionModel } from "../../../models/action.model";
import { ApplicationStateModel } from "../../../models/application-state.model";
import { UndoableConfig } from "../../undoable.action-creator";
import { ScheduleDataActionCreator } from "./schedule-data.action-creator";

export function isScheduleAction(action: ActionModel<unknown>): action is ScheduleActionModel {
  return !_.isNil((action.payload as ScheduleDataModel)?.schedule_info);
}

export type ScheduleActionModel = ActionModel<ScheduleDataModel>;

export enum ScheduleActionType {
  UPDATE = "UPDATE_SCHEDULE",
  ADD_NEW = "ADD_NEW_SCHEDULE",
  COPY_TO_MONTH = "COPY_TO_MONTH",
  ADD_NEW_WORKER = "ADD_NEW_WORKER",
  MODIFY_WORKER = "MODIFY_WORKER",
}

export function createActionName(name: string, action: ScheduleActionType): string {
  return `${name}/${action}`;
}

async function updatePersistentSchedule(
  dispatch: ThunkDispatch<ApplicationStateModel, void, ActionModel<ScheduleDataModel>>,
  state: ScheduleDataModel
): Promise<void> {
  const storeProvider = new LocalStorageProvider();
  storeProvider.saveScheduleRevision("actual", state);
  state &&
    (await dispatch(ScheduleDataActionCreator.addNewSchedule(TEMPORARY_SCHEDULE_NAME, state)));
}

export const PERSISTENT_SCHEDULE_UNDOABLE_CONFIG: UndoableConfig<ScheduleDataModel> = {
  undoType: "PERSISTENT_REVISION_UNDO",
  redoType: "PERSISTENT_REVISION_REDO",
  afterUndo: async (dispatch, getState) => {
    const state = getState().actualState.persistentSchedule.present;
    debugger;
    await updatePersistentSchedule(dispatch, state);
  },
  afterRedo: async (dispatch, getState) => {
    const state = getState().actualState.persistentSchedule.present;
    debugger;
    await updatePersistentSchedule(dispatch, state);
  },
};

export const TEMPORARY_SCHEDULE_UNDOABLE_CONFIG: UndoableConfig<ScheduleDataModel> = {
  undoType: "TEMPORARY_REVISION_UNDO",
  redoType: "TEMPORARY_REVISION_REDO",
};
