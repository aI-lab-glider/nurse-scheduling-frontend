/* eslint-disable @typescript-eslint/camelcase */

/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import { ScheduleDataModel } from "../../../../common-models/schedule-data.model";
import { ScheduleDataActionCreator } from "./schedule-data.action-creator";
import { UndoableConfig } from "../../undoable.action-creator";
import { LocalStorageProvider } from "../../../../api/local-storage-provider.model";
import { ThunkDispatch } from "redux-thunk";
import { ApplicationStateModel } from "../../../models/application-state.model";
import { ActionModel } from "../../../models/action.model";
import { combineReducers } from "redux";

import { CombinedReducers, TEMPORARY_SCHEDULE_NAME } from "../../../app.reducer";
import { scheduleInfoReducerF } from "../schedule-info.reducer";
import { scheduleShiftsInfoReducerF } from "../shifts-info.reducer";
import { monthInfoReducerF } from "../month-info.reducer";
import { employeeInfoReducerF } from "../employee-info.reducer";

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

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export function scheduleReducerF(name: string) {
  return combineReducers({
    schedule_info: scheduleInfoReducerF(name),
    shifts: scheduleShiftsInfoReducerF(name),
    month_info: monthInfoReducerF(name),
    employee_info: employeeInfoReducerF(name),
  } as CombinedReducers<ScheduleDataModel>);
}
