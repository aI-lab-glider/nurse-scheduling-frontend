import { ImportButtonsActionType } from "../../components/toolbar/import-buttons";
import { ActionModel } from "../models/action.model";
import { ScheduleDataModel } from "../models/schedule-data/schedule-data.model";

export function scheduleDataReducer(
  state: ScheduleDataModel = {},
  action: ActionModel<ScheduleDataModel>
) {
  switch (action.type) {
    case ImportButtonsActionType.IMPORT:
      return Object.assign({}, state, action.payload);
    default:
      return state;
  }
}
