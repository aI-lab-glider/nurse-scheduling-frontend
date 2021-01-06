/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
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
/* eslint-enable @typescript-eslint/camelcase */
