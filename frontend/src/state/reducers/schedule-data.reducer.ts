import { ActionModel } from "../models/action.model";
import { ScheduleDataModel } from "../models/schedule-data/schedule-data.model";

export enum ScheduleDataActionType {
  UPDATE = "updateScheduleData",
  ADD_NEW = "addNew",
}

export function scheduleDataReducer(
  state: ScheduleDataModel = {},
  action: ActionModel<ScheduleDataModel>
) {
  let scheduleModel = action.payload;
  switch (action.type) {
    case ScheduleDataActionType.ADD_NEW:
      scheduleModel.isNew = true;
      return Object.assign({}, state, scheduleModel);
    case ScheduleDataActionType.UPDATE:
      scheduleModel.isNew = false;
      return Object.assign({}, state, scheduleModel);
    default:
      return state;
  }
}
