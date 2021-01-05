import { ScheduleModel } from "../../../common-models/schedule.model";
import { PersistentScheduleActionType } from "./schedule-data/persistent";

import { scheduleDataInitialState } from "./schedule-data/schedule-data-initial-state";
import { ScheduleActionModel } from "./schedule-data/schedule-data.action-creator";
import { TemporaryScheduleActionType } from "./schedule-data/temporary-schedule.reducer";

let uuid = 0;

/* eslint-disable @typescript-eslint/camelcase */

export function scheduleInfoReducer(
  state: ScheduleModel = scheduleDataInitialState.schedule_info,
  action: ScheduleActionModel
): ScheduleModel {
  const data = action.payload?.schedule_info;
  if (!data) return state;
  switch (action.type) {
    case PersistentScheduleActionType.SET_REVISION:
    case TemporaryScheduleActionType.ADD_NEW:
      uuid += 1;
      return { ...data, UUID: uuid.toString() };
    case TemporaryScheduleActionType.UPDATE:
      return { ...state, ...data };
    case PersistentScheduleActionType.COPY_FROM_MONTH:
      const { month_number, year } = (action.payload as unknown) as {
        month_number: number;
        year: number;
      };
      return { ...state, month_number, year };
    default:
      return state;
  }
}
