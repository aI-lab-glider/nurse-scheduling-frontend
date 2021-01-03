import { ScheduleDataModel } from "../../../common-models/schedule-data.model";
import { scheduleDataInitialState } from "./schedule-data-initial-state";
import { ScheduleActionModel, ScheduleDataActionCreator } from "./schedule-data.action-creator";
import { UndoableConfig } from "../undoable.action-creator";

export enum PersistentScheduleActionType {
  SET_REVISION = "setRevision",
}

export const PERSISTENT_SCHEDULE_UNDOABLE_CONFIG: UndoableConfig<ScheduleDataModel> = {
  undoType: "ACTUAL_REVISION_UNDO",
  redoType: "ACTUAL_REVISION_REDO",
  afterUndo: async (dispatch, getState) => {
    const state = getState().persistentSchedule.present;
    state && (await dispatch(ScheduleDataActionCreator.addNewSchedule(state)));
  },
  afterRedo: async (dispatch, getState) => {
    const state = getState().persistentSchedule.present;
    state && (await dispatch(ScheduleDataActionCreator.addNewSchedule(state)));
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
