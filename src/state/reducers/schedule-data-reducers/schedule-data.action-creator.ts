import { ThunkFunction } from "../../../api/persistance-store.model";
import { ScheduleDataModel } from "../../../common-models/schedule-data.model";
import { ActualRevisionActionaType, actualRevisionMeta } from "./actual-revision.reducer";
import {
  editableScheduleMeta,
  ScheduleActionModel,
  ScheduleDataActionType,
} from "./schedule-data.reducer";

export class ScheduleDataActionCreator {
  static addNewSchedule(newSchedule: ScheduleDataModel): ThunkFunction<ScheduleDataModel> {
    return async (dispatch, getState): Promise<void> => {
      const setEditableSchedule = {
        type: ScheduleDataActionType.ADD_NEW,
        payload: newSchedule,
        meta: editableScheduleMeta,
      };
      const setActualRevision = {
        type: ActualRevisionActionaType.SET_REVISION,
        payload: newSchedule,
        meta: actualRevisionMeta,
      };
      dispatch(setActualRevision);
      dispatch(setEditableSchedule);
    };
  }

  static updateSchedule(newScheduleModel: ScheduleDataModel): ScheduleActionModel {
    return {
      type: ScheduleDataActionType.UPDATE,
      payload: newScheduleModel,
      meta: editableScheduleMeta,
    };
  }
}
