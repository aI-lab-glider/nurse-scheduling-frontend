import { combineReducers } from "redux";
import { ScheduleDataModel } from "../../../common-models/schedule-data.model";
import { ActionModel } from "../../models/action.model";
import { employeeInfoReducer } from "../employee-info.reducer";
import { monthInfoReducer } from "../month-info.reducer";
import { scheduleInfoReducer } from "../schedule-info.reducer";
import { shiftsInfoReducer } from "../shifts-info.reducer";

export enum ScheduleDataActionType {
  UPDATE = "updateScheduleData",
  ADD_NEW = "addNew",
}

export const editableScheduleMeta = "EDIT";

/* eslint-disable @typescript-eslint/camelcase */
type ScheduleDataReducers = {
  [key in keyof ScheduleDataModel]: <T, U>(state: T, action: ActionModel<U>) => T;
};
export type ScheduleActionModel = ActionModel<ScheduleDataModel>;
export const scheduleDataReducer = combineReducers({
  schedule_info: scheduleInfoReducer,
  shifts: shiftsInfoReducer,
  month_info: monthInfoReducer,
  employee_info: employeeInfoReducer,
} as ScheduleDataReducers);
/* eslint-enable @typescript-eslint/camelcase */
