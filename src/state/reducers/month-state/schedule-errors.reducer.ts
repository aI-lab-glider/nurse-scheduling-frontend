import { ErrorMessageHelper } from "../../../helpers/error-message.helper";
import { ActionModel } from "../../models/action.model";
import { ScheduleErrorMessageModel } from "../../../common-models/schedule-error-message.model";
import { ScheduleError } from "../../../common-models/schedule-error.model";

export enum ScheduleErrorActionType {
  UPDATE = "updateScheduleError",
}

export function scheduleErrorsReducer(
  state: ScheduleErrorMessageModel[] = [],
  action: ActionModel<ScheduleError[]>
): ScheduleErrorMessageModel[] {
  switch (action.type) {
    case ScheduleErrorActionType.UPDATE:
      if (!action.payload) action.payload = [];
      return [...action.payload?.map((e) => ErrorMessageHelper.getErrorMessage(e))];
    default:
      return state;
  }
}
