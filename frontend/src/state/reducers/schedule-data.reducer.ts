import { ActionModel } from "../models/action.model";
import { ScheduleDataModel } from "../models/schedule-data/schedule-data.model";

export enum ScheduleDataActionType {
  UPDATE = "update",
}
export function scheduleDataReducer(
  state: ScheduleDataModel = {},
  action: ActionModel<ScheduleDataModel>
) {
  switch (action.type) {
    case ScheduleDataActionType.UPDATE:
      return Object.assign({}, state, action.payload);
    default:
      return state;
  }
}
