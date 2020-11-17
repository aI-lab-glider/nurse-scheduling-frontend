import { ActionModel } from "../models/action.model";
import { ScheduleDataModel } from "../../common-models/schedule-data.model";
import { combineReducers } from "redux";
import { scheduleInfoReducer } from "./schedule-info.reducer";
import { shiftsInfoReducer } from "./shifts-info.reducer";
import { monthInfoReducer } from "./month-info.reducer";
import { employeeInfoReducer } from "./employee-info.reducer";

export enum ScheduleDataActionType {
  UPDATE = "updateScheduleData",
  ADD_NEW = "addNew",
}

export type ScheduleActionModel = ActionModel<ScheduleDataModel>;
/* eslint-disable @typescript-eslint/camelcase */
export const scheduleDataReducer = combineReducers({
  schedule_info: scheduleInfoReducer,
  shifts: shiftsInfoReducer,
  month_info: monthInfoReducer,
  employee_info: employeeInfoReducer,
} as { [key in keyof ScheduleDataModel]: <T, U>(state: T, action: ActionModel<U>) => T });
/* eslint-enable @typescript-eslint/camelcase */
