import { WorkersInfoModel } from "../../common-models/worker-info.model";
import { ScheduleActionModel, ScheduleDataActionType } from "./schedule-data.reducer";

const initialState: WorkersInfoModel = { time: {}, type: {} };
export function employeeInfoReducer(
  state: WorkersInfoModel = initialState,
  action: ScheduleActionModel
): WorkersInfoModel {
  const data = action.payload?.employee_info;
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
