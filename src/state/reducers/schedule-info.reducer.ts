import { ScheduleModel } from "../../common-models/schedule.model";
import { ScheduleActionModel, ScheduleDataActionType } from "./schedule-data.reducer";

let uuid = 0;
/* eslint-disable @typescript-eslint/camelcase */
const initialState: ScheduleModel = {
  month_number: -1,
  year: -1,
  daysFromPreviousMonthExists: false,
};

export function scheduleInfoReducer(
  state: ScheduleModel = initialState,
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
