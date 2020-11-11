import { MonthInfoModel } from "../../common-models/month-info.model";
import { ScheduleActionModel, ScheduleDataActionType } from "./schedule-data.reducer";

/* eslint-disable @typescript-eslint/camelcase */
const initialState: MonthInfoModel = {
  frozen_shifts: [],
  dates: [],
};
/* eslint-enable @typescript-eslint/camelcase */

export function monthInfoReducer(
  state: MonthInfoModel = initialState,
  action: ScheduleActionModel
): MonthInfoModel {
  const data = action.payload?.month_info;
  if (!data) {
    return state;
  }
  switch (action.type) {
    case ScheduleDataActionType.ADD_NEW:
      return { ...data };
    case ScheduleDataActionType.UPDATE:
      return { ...state, ...data };
    default:
      return state;
  }
}
