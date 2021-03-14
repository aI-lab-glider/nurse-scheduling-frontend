/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */

import * as _ from "lodash";
import { ThunkDispatch } from "redux-thunk";
import { ScheduleDataModel } from "../../../../common-models/schedule-data.model";
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
  UPDATE_WORKER_INFO = "UPDATE_WORKER_INFO",
  CLEAN_ERRORS = "CLEAN_ERRORS",
  ADD_NEW_SHIFT = "ADD_NEW_SHIFT",
  MODIFY_SHIFT = "MODIFY_SHIFT",
  DELETE_SHIFT = "DELETE_SHIFT",
  SET_SCHEDULE_CORRUPTED = "SET_SCHEDULE_CORRUPTED",
}

export function createActionName(name: string, action: ScheduleActionType): string {
  return `${name}/${action}`;
}

function updatePersistentSchedule(
  dispatch: ThunkDispatch<ApplicationStateModel, void, ActionModel<ScheduleDataModel>>,
  state: ScheduleDataModel
): void {
  dispatch(ScheduleDataActionCreator.setScheduleStateAndSaveToDb(state));
}

export const PERSISTENT_SCHEDULE_UNDOABLE_CONFIG: UndoableConfig<ScheduleDataModel> = {
  undoType: "PERSISTENT_REVISION_UNDO",
  redoType: "PERSISTENT_REVISION_REDO",
  clearHistoryType: "PERSISTENT_CLEAR_HISTORY",
  afterUndo: (dispatch, getState) => {
    const state = getState().actualState.persistentSchedule.present;
    updatePersistentSchedule(dispatch, state);
  },
  afterRedo: (dispatch, getState) => {
    const state = getState().actualState.persistentSchedule.present;
    updatePersistentSchedule(dispatch, state);
  },
};

export const TEMPORARY_SCHEDULE_UNDOABLE_CONFIG: UndoableConfig<ScheduleDataModel> = {
  undoType: "TEMPORARY_REVISION_UNDO",
  redoType: "TEMPORARY_REVISION_REDO",
  clearHistoryType: "TEMPORARY_CLEAR_HISTORY",
};
