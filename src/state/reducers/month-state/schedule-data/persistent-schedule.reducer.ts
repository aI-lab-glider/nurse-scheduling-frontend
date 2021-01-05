/* eslint-disable @typescript-eslint/camelcase */

import { ScheduleDataModel } from "../../../../common-models/schedule-data.model";
import { ScheduleDataActionCreator } from "./schedule-data.action-creator";
import { UndoableConfig } from "../../undoable.action-creator";
import { LocalStorageProvider } from "../../../../api/local-storage-provider.model";
import { ThunkDispatch } from "redux-thunk";
import { ApplicationStateModel } from "../../../models/application-state.model";
import { ActionModel } from "../../../models/action.model";
import { combineReducers } from "redux";

import { CombinedReducers } from "../../../app.reducer";
import { employeeInfoReducer } from "../employee-info.reducer";
import { persistentScheduleMonthInfoReducer } from "../month-info.reducer";
import { scheduleInfoReducer } from "../schedule-info.reducer";
import { persistenScheduletShiftsInfoReducer } from "../shifts-info.reducer";

async function updatePersistentSchedule(
  dispatch: ThunkDispatch<ApplicationStateModel, void, ActionModel<ScheduleDataModel>>,
  state: ScheduleDataModel
): Promise<void> {
  const storeProvider = new LocalStorageProvider();
  storeProvider.saveScheduleRevision("actual", state);
  state && (await dispatch(ScheduleDataActionCreator.setTemporarySchedule(state)));
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

export const persistentScheduleReducer = combineReducers({
  schedule_info: scheduleInfoReducer,
  shifts: persistenScheduletShiftsInfoReducer,
  month_info: persistentScheduleMonthInfoReducer,
  employee_info: employeeInfoReducer,
} as CombinedReducers<ScheduleDataModel>);
