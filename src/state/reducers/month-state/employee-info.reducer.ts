import { WorkersInfoModel } from "../../../common-models/worker-info.model";
import { scheduleDataInitialState } from "./schedule-data/schedule-data-initial-state";
import { ScheduleActionModel } from "./schedule-data/schedule-data.action-creator";
import { TemporaryScheduleActionType } from "./schedule-data/temporary-schedule.reducer";

/* eslint-disable @typescript-eslint/camelcase */
export function employeeInfoReducer(
  state: WorkersInfoModel = scheduleDataInitialState.employee_info,
  action: ScheduleActionModel
): WorkersInfoModel {
  const data = action.payload?.employee_info;
  if (!data) return state;
  switch (action.type) {
    case TemporaryScheduleActionType.ADD_NEW:
      return { ...data };
    case TemporaryScheduleActionType.UPDATE:
      return { ...state, ...data };
    default:
      return state;
  }
}