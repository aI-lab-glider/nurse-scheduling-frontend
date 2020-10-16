import { ErrorMessageHelper } from "../../helpers/error-message.helper";
import { ActionModel } from "../models/action.model";
import { ScheduleErrorMessageModel } from "../models/schedule-data/schedule-error-message.model";
import { ScheduleErrorModel } from "../models/schedule-data/schedule-error.model";

export enum ScheduleErrorActionType {
  UPDATE = "updateScheduleError",
}

export function scheduleErrorsReducer(
  state: ScheduleErrorMessageModel[] = [],
  action: ActionModel<ScheduleErrorModel[]>
) {
  switch (action.type) {
    case ScheduleErrorActionType.UPDATE:
      return [...action.payload.map((e) => ErrorMessageHelper.getErrorMessage(e))];
    default:
      return state;
  }
}
