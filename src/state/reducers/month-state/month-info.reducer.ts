import { MonthInfoModel } from "../../../common-models/month-info.model";
import { copyMonthInfo } from "./schedule-data/common-reducers";
import { PersistentScheduleActionType } from "./schedule-data/persistent";

import { scheduleDataInitialState } from "./schedule-data/schedule-data-initial-state";
import { ScheduleActionModel } from "./schedule-data/schedule-data.action-creator";
import { TemporaryScheduleActionType } from "./schedule-data/temporary-schedule.reducer";

/* eslint-disable @typescript-eslint/camelcase */
export function monthInfoReducer(
  state: MonthInfoModel = scheduleDataInitialState.month_info,
  action: ScheduleActionModel
): MonthInfoModel {
  const data = action.payload?.month_info;
  if (!data && action.type !== TemporaryScheduleActionType.COPY_FROM_MONTH) {
    return state;
  }
  switch (action.type) {
    case TemporaryScheduleActionType.ADD_NEW:
      return { ...state, ...data };
    case TemporaryScheduleActionType.UPDATE:
      return { ...state, ...data };
    case TemporaryScheduleActionType.COPY_FROM_MONTH:
      const { month_number, year } = (action.payload as unknown) as {
        month_number: number;
        year: number;
      };

      return copyMonthInfo(month_number, year, state);
    default:
      return state;
  }
}

export function persistentScheduleMonthInfoReducer(
  state: MonthInfoModel = scheduleDataInitialState.month_info,
  action: ScheduleActionModel
): MonthInfoModel {
  const data = action.payload?.month_info;

  if (!data && action.type !== PersistentScheduleActionType.COPY_FROM_MONTH) {
    return state;
  }
  switch (action.type) {
    case PersistentScheduleActionType.SET_REVISION:
      return { ...state, ...data };
    case PersistentScheduleActionType.COPY_FROM_MONTH:
      const { month_number, year } = (action.payload as unknown) as {
        month_number: number;
        year: number;
      };

      return copyMonthInfo(month_number, year, state);
    default:
      return state;
  }
}
/* eslint-enable @typescript-eslint/camelcase */
