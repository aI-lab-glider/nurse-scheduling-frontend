import { ScheduleDataModel } from "../../../common-models/schedule-data.model";
import { scheduleDataInitialState } from "./schedule-data-initial-state";
import { ScheduleActionModel } from "./schedule-data.reducer";
import { UndoableConfig } from "./schedule-data.action-creator";

export enum ActualRevisionActionType {
  SET_REVISION = "setRevision",
}

export const ACTUAL_REVISION_UNDOABLE_CONFIG: UndoableConfig = {
  undoType: "ACTUAL_REVISION_UNDO",
  redoType: "ACTUAL_REVISION_REDO",
};

export function actualRevisionReducer(
  state: ScheduleDataModel = scheduleDataInitialState,
  action: ScheduleActionModel
): ScheduleDataModel {
  const data = action.payload;
  if (!data) return state;
  switch (action.type) {
    case ActualRevisionActionType.SET_REVISION:
      return { ...data };
    default:
      return state;
  }
}
