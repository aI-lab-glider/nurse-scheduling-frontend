import { ScheduleDataModel } from "../../../../common-models/schedule-data.model";
import { scheduleDataInitialState } from "./schedule-data-initial-state";
import { ScheduleActionModel, ScheduleDataActionCreator } from "./schedule-data.action-creator";
import { UndoableConfig } from "../../undoable.action-creator";
import { LocalStorageProvider } from "../../../../api/local-storage-provider.model";
import { ThunkDispatch } from "redux-thunk";
import { ApplicationStateModel } from "../../../models/application-state.model";
import { ActionModel } from "../../../models/action.model";

export enum PersistentScheduleActionType {
  SET_REVISION = "SET_REVISION",
}

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

export function persistentScheduleReducer(
  state: ScheduleDataModel = scheduleDataInitialState,
  action: ScheduleActionModel
): ScheduleDataModel {
  const data = action.payload;
  if (!data) return state;
  switch (action.type) {
    case PersistentScheduleActionType.SET_REVISION:
      return { ...data };
    default:
      return state;
  }
}
