import { MonthInfoModel } from "../../../common-models/month-info.model";
import { scheduleDataInitialState } from "./schedule-data/schedule-data-initial-state";
import { ScheduleActionModel } from "./schedule-data/schedule-data.action-creator";
import { TemporaryScheduleActionType } from "./schedule-data/temporary-schedule.reducer";

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
