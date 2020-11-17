import { ShiftInfoModel } from "../../common-models/shift-info.model";
import { ScheduleActionModel, ScheduleDataActionType } from "./schedule-data.reducer";

const initialState: ShiftInfoModel = {};
export function shiftsInfoReducer(
  state: ShiftInfoModel = initialState,
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
