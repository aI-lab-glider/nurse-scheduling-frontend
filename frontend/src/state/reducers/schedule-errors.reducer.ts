import { ActionModel } from "../models/action.model";
import { ScheduleErrorMessageModel } from "../models/schedule-data/schedule-error-message.model";

export enum ScheduleErrorActionType {
  UPDATE = "updateScheduleError",
}

export function scheduleErrorsReducer(
  state: ScheduleErrorMessageModel[] = [],
  action: ActionModel<ScheduleErrorMessageModel[]>
) {
  switch (action.type) {
    case ScheduleErrorActionType.UPDATE:
      return [...action.payload];
    default:
      return state;
  }
}
