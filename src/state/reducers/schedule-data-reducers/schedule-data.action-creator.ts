import { ThunkFunction } from "../../../api/persistance-store.model";
import { ScheduleDataModel } from "../../../common-models/schedule-data.model";
import { PersistentScheduleActionType } from "./persistent-schedule.reducer";
import { TemporaryScheduleActionType } from "./temporary-schedule.reducer";
import { ActionModel } from "../../models/action.model";

export type ScheduleActionModel = ActionModel<ScheduleDataModel>;
export class ScheduleDataActionCreator {
  static addNewSchedule(newSchedule: ScheduleDataModel): ThunkFunction<ScheduleDataModel> {
    return async (dispatch): Promise<void> => {
      const setEditableSchedule = {
        type: TemporaryScheduleActionType.ADD_NEW,
        payload: newSchedule,
      };
      const setActualRevision = {
        type: PersistentScheduleActionType.SET_REVISION,
        payload: newSchedule,
      };
      dispatch(setActualRevision);
      dispatch(setEditableSchedule);
    };
  }

  static updateSchedule(newScheduleModel: ScheduleDataModel): ScheduleActionModel {
    return {
      type: TemporaryScheduleActionType.UPDATE,
      payload: newScheduleModel,
    };
  }
}
