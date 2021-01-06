import { ScheduleModel } from "../../../common-models/schedule.model";
import { createActionName } from "./schedule-data/common-reducers";
import { scheduleDataInitialState } from "./schedule-data/schedule-data-initial-state";
import { ScheduleActionModel } from "./schedule-data/schedule-data.action-creator";
import { ScheduleActionType } from "./schedule-data/temporary-schedule.reducer";

let uuid = 0;

/* eslint-disable @typescript-eslint/camelcase */

export function scheduleInfoReducerF(name: string) {
  return (
    state: ScheduleModel = scheduleDataInitialState.schedule_info,
    action: ScheduleActionModel
  ): ScheduleModel => {
    const data = action.payload?.schedule_info;
    switch (action.type) {
      case createActionName(name, ScheduleActionType.ADD_NEW):
        uuid += 1;
        if (!data) return state;
        return { ...data, UUID: uuid.toString() };
      case createActionName(name, ScheduleActionType.UPDATE):
        if (!data) return state;
        return { ...state, ...data };
      case createActionName(name, ScheduleActionType.COPY_FROM_MONTH):
        const { month_number, year } = (action.payload as unknown) as {
          month_number: number;
          year: number;
        };
        return { ...state, month_number, year };
      default:
        return state;
    }
  };
}
