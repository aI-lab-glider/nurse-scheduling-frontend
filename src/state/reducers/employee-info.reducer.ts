import { WorkersInfoModel } from "../../common-models/worker-info.model";
import { scheduleDataInitialState } from "./schedule-data-reducers/schedule-data-initial-state";
import {
  ScheduleActionModel,
  ScheduleDataActionType,
} from "./schedule-data-reducers/schedule-data.reducer";

/* eslint-disable @typescript-eslint/camelcase */
export function employeeInfoReducer(
  state: WorkersInfoModel = scheduleDataInitialState.employee_info,
  action: ScheduleActionModel
): WorkersInfoModel {
  const data = action.payload?.employee_info;
  if (!data) return state;
  switch (action.type) {
    case ScheduleDataActionType.ADD_NEW:
      return { ...data };
    case ScheduleDataActionType.UPDATE:
      return { ...state, ...data };
    default:
      return state;
  }
}
