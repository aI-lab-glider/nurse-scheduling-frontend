import { ShiftInfoModel } from "../../common-models/shift-info.model";
import { scheduleDataInitialState } from "./schedule-data-reducers/schedule-data-initial-state";
import {
  ScheduleActionModel,
  ScheduleDataActionType,
} from "./schedule-data-reducers/schedule-data.reducer";

export function shiftsInfoReducer(
  state: ShiftInfoModel = scheduleDataInitialState.shifts,
  action: ScheduleActionModel
): ShiftInfoModel {
  const data = action.payload?.shifts;
  if (!data) return state;
  switch (action.type) {
    case ScheduleDataActionType.ADD_NEW:
      return { ...data };
    case ScheduleDataActionType.UPDATE:
      return { ...state, ...data };
    default:
      return state;
  }
}
