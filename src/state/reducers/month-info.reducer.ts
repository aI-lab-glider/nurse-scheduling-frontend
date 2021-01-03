import { MonthInfoModel } from "../../common-models/month-info.model";
import { scheduleDataInitialState } from "./schedule-data-reducers/schedule-data-initial-state";
import { TemporaryScheduleActionType } from "./schedule-data-reducers/temporary-schedule.reducer";
import { ScheduleActionModel } from "./schedule-data-reducers/schedule-data.action-creator";

/* eslint-disable @typescript-eslint/camelcase */
export function monthInfoReducer(
  state: MonthInfoModel = scheduleDataInitialState.month_info,
  action: ScheduleActionModel
): MonthInfoModel {
  const data = action.payload?.month_info;
  if (!data) {
    return state;
  }
  switch (action.type) {
    case TemporaryScheduleActionType.ADD_NEW:
      return { ...data };
    case TemporaryScheduleActionType.UPDATE:
      return { ...state, ...data };
    default:
      return state;
  }
}
/* eslint-enable @typescript-eslint/camelcase */
