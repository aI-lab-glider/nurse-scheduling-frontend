import { ShiftInfoModel } from "../../../common-models/shift-info.model";
import { scheduleDataInitialState } from "./schedule-data/schedule-data-initial-state";
import { TemporaryScheduleActionType } from "./schedule-data/temporary-schedule.reducer";
import { ScheduleActionModel } from "./schedule-data/schedule-data.action-creator";

export function shiftsInfoReducer(
  state: ShiftInfoModel = scheduleDataInitialState.shifts,
  action: ScheduleActionModel
): ShiftInfoModel {
  const data = action.payload?.shifts;
  if (!data) return state;
  switch (action.type) {
    case TemporaryScheduleActionType.ADD_NEW:
      return { ...data };
    case TemporaryScheduleActionType.UPDATE:
      return { ...state, ...data };
    default:
      return state;
  }
}
