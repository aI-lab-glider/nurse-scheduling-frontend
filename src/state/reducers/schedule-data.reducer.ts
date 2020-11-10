import { MonthLogicActionType } from "../../logic/schedule-logic/metadata.logic";
import { ActionModel } from "../models/action.model";
import { MonthInfoModel } from "../../common-models/month-info.model";
import { ScheduleDataModel } from "../../common-models/schedule-data.model";
import undoable from "redux-undo";

let uuid = 0;

export enum ScheduleDataActionType {
  UPDATE = "updateScheduleData",
  ADD_NEW = "addNew",
}

function scheduleDataReducer(
  state: ScheduleDataModel = {},
  action: ActionModel<ScheduleDataModel>
): ScheduleDataModel {
  const scheduleModel = action.payload;
  switch (action.type) {
    case ScheduleDataActionType.ADD_NEW:
      scheduleModel.isNew = true;
      uuid += 1;
      if (scheduleModel.schedule_info) scheduleModel.schedule_info.UUID = uuid.toString();
      return Object.assign({}, state, scheduleModel);
    case ScheduleDataActionType.UPDATE:
      scheduleModel.isNew = false;
      return Object.assign({}, state, scheduleModel);
    case MonthLogicActionType.UpdateFrozenDates:
      scheduleModel.isNew = false;
      return Object.assign({}, state, {
        /* eslint-disable @typescript-eslint/camelcase */
        month_info: {
          ...state.month_info,
          frozen_shifts: action.payload,
        } as MonthInfoModel,
        /* eslint-enable @typescript-eslint/camelcase */
      });
    default:
      return state;
  }
}

export default undoable(scheduleDataReducer);
