import { MonthInfoModel } from "../../../common-models/month-info.model";
import { daysInMonth } from "./schedule-data/month-preparation";
import { PersistentScheduleActionType } from "./schedule-data/persistent-schedule.reducer";
import { scheduleDataInitialState } from "./schedule-data/schedule-data-initial-state";
import { ScheduleActionModel } from "./schedule-data/schedule-data.action-creator";
import { TemporaryScheduleActionType } from "./schedule-data/temporary-schedule.reducer";

/* eslint-disable @typescript-eslint/camelcase */
export function monthInfoReducer(
  state: MonthInfoModel = scheduleDataInitialState.month_info,
  action: ScheduleActionModel
): MonthInfoModel {
  const data = action.payload?.month_info;
  if (!data && action.type !== PersistentScheduleActionType.COPY_FROM_MONTH) {
    return state;
  }
  switch (action.type) {
    case TemporaryScheduleActionType.ADD_NEW:
      return { ...state, ...data };
    case TemporaryScheduleActionType.UPDATE:
      return { ...state, ...data };
    case PersistentScheduleActionType.COPY_FROM_MONTH:
      const { month_number, year } = (action.payload as unknown) as {
        month_number: number;
        year: number;
      };
      const days = daysInMonth(month_number, year);
      const newState: MonthInfoModel = {
        children_number: state.children_number?.slice(0, days.length),
        extra_workers: state.extra_workers?.slice(0, days.length),
        dates: days,
        frozen_shifts: [],
      };
      return newState;
    default:
      return state;
  }
}
/* eslint-enable @typescript-eslint/camelcase */
