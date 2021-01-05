import { combineReducers } from "redux";
import { ScheduleDataModel } from "../../../../common-models/schedule-data.model";
import { CombinedReducers } from "../../../app.reducer";
import { UndoableConfig } from "../../undoable.action-creator";
import { employeeInfoReducer } from "../employee-info.reducer";
import { monthInfoReducer } from "../month-info.reducer";
import { scheduleInfoReducer } from "../schedule-info.reducer";
import { shiftsInfoReducer } from "../shifts-info.reducer";

export enum TemporaryScheduleActionType {
  UPDATE = "UPDATE_SCHEDULE",
  ADD_NEW = "ADD_NEW_SCHEDULE",
  COPY_FROM_MONTH = "COPY_FROM_MONTH",
}

export const TEMPORARY_SCHEDULE_UNDOABLE_CONFIG: UndoableConfig<ScheduleDataModel> = {
  undoType: "TEMPORARY_REVISION_UNDO",
  redoType: "TEMPORARY_REVISION_REDO",
};
/* eslint-disable @typescript-eslint/camelcase */
export const temporaryScheduleReducer = combineReducers({
  schedule_info: scheduleInfoReducer,
  shifts: shiftsInfoReducer,
  month_info: monthInfoReducer,
  employee_info: employeeInfoReducer,
} as CombinedReducers<ScheduleDataModel>);
