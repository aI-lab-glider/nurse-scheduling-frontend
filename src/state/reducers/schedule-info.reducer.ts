import { ScheduleModel } from "../../common-models/schedule.model";
import { scheduleDataInitialState } from "./schedule-data-reducers/schedule-data-initial-state";
import {
  ScheduleActionModel,
  ScheduleDataActionType,
} from "./schedule-data-reducers/schedule-data.reducer";

let uuid = 0;
/* eslint-disable @typescript-eslint/camelcase */

export function scheduleInfoReducer(
  state: ScheduleModel = scheduleDataInitialState.schedule_info,
  action: ScheduleActionModel
): ScheduleModel {
  const data = action.payload?.schedule_info;
  if (!data) return state;
  switch (action.type) {
    case ScheduleDataActionType.ADD_NEW:
      uuid += 1;
      return { ...data, UUID: uuid.toString() };
    case ScheduleDataActionType.UPDATE:
      return { ...state, ...data };
    default:
      return state;
  }
}
