import { combineReducers } from "redux";
import { ScheduleDataModel } from "../../../common-models/schedule-data.model";
import { ActionModel } from "../../models/action.model";
import { employeeInfoReducer } from "../employee-info.reducer";
import { monthInfoReducer } from "../month-info.reducer";
import { scheduleInfoReducer } from "../schedule-info.reducer";
import { shiftsInfoReducer } from "../shifts-info.reducer";
import { UndoableConfig } from "../undoable.action-creator";

export enum TemporaryScheduleActionType {
  UPDATE = "UPDATE_SCHEDULE",
  ADD_NEW = "ADD_NEW_SCHEDULE",
}

export const TEMPORARY_SCHEDULE_UNDOABLE_CONFIG: UndoableConfig<ScheduleDataModel> = {
  undoType: "TEMPORARY_REVISION_UNDO",
  redoType: "TEMPORARY_REVISION_REDO",
};
/* eslint-disable @typescript-eslint/camelcase */
type ScheduleDataReducers = {
  [key in keyof ScheduleDataModel]: <T, U>(state: T, action: ActionModel<U>) => T;
};

export const temporaryScheduleReducer = combineReducers({
  schedule_info: scheduleInfoReducer,
  shifts: shiftsInfoReducer,
  month_info: monthInfoReducer,
  employee_info: employeeInfoReducer,
} as ScheduleDataReducers);
/* eslint-enable @typescript-eslint/camelcase */
