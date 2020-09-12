import { ActionModel } from "../models/action.model";
import { ScheduleErrorModel } from "../models/schedule-data/schedule-error.model";

export enum ScheduleErrorActionType {
  UPDATE = "updateScheduleError",
}

export function scheduleErrorsReducer(
  state: ScheduleErrorModel[] = [],
  action: ActionModel<ScheduleErrorModel[]>
) {
  switch (action.type) {
    case ScheduleErrorActionType.UPDATE:
      return [...action.payload];
    default:
      return state;
  }
}
