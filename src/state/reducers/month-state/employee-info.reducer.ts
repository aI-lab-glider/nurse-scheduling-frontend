import { WorkersInfoModel } from "../../../common-models/worker-info.model";
import { createActionName } from "./schedule-data/common-reducers";
import { scheduleDataInitialState } from "./schedule-data/schedule-data-initial-state";
import { ScheduleActionModel } from "./schedule-data/schedule-data.action-creator";
import { ScheduleActionType } from "./schedule-data/temporary-schedule.reducer";

/* eslint-disable @typescript-eslint/camelcase */
export function employeeInfoReducerF(name: string) {
  return (
    state: WorkersInfoModel = scheduleDataInitialState.employee_info,
    action: ScheduleActionModel
  ): WorkersInfoModel => {
    const data = action.payload?.employee_info;
    if (!data) return state;
    switch (action.type) {
      case createActionName(name, ScheduleActionType.ADD_NEW):
        return { ...data };
      case createActionName(name, ScheduleActionType.UPDATE):
        return { ...state, ...data };
      default:
        return state;
    }
  };
}
