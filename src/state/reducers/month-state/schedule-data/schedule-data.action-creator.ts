import { ThunkFunction } from "../../../../api/persistance-store.model";
import { ScheduleDataModel } from "../../../../common-models/schedule-data.model";
import { PersistentScheduleActionType } from "./persistent-schedule.reducer";
import { TemporaryScheduleActionType } from "./temporary-schedule.reducer";
import { ActionModel } from "../../../models/action.model";
import { HistoryReducerActionCreator } from "../../history.reducer";

export type ScheduleActionModel = ActionModel<ScheduleDataModel>;
export class ScheduleDataActionCreator {
  static setPersistentSchedule(newSchedule: ScheduleDataModel): ThunkFunction<ScheduleDataModel> {
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

  static copyPreviousMonth(): ThunkFunction<unknown> {
    return async (dispatch, getState): Promise<void> => {
      const actualSchedule = getState().actualState;
      // eslint-disable-next-line @typescript-eslint/camelcase
      const action = HistoryReducerActionCreator.addToHistory(actualSchedule);
      const copyAction = {
        type: PersistentScheduleActionType.COPY_FROM_MONTH,
        payload: {
          // eslint-disable-next-line @typescript-eslint/camelcase
          month_number:
            actualSchedule.persistentSchedule.present.schedule_info.month_number ?? 0 % 12,
          year: actualSchedule.persistentSchedule.present.schedule_info.year,
        },
      };
      dispatch(action);
      dispatch(copyAction);
    };
  }
  static setTemporarySchedule(newSchedule: ScheduleDataModel): ScheduleActionModel {
    return {
      type: TemporaryScheduleActionType.ADD_NEW,
      payload: newSchedule,
    };
  }

  static updateSchedule(newScheduleModel: ScheduleDataModel): ScheduleActionModel {
    return {
      type: TemporaryScheduleActionType.UPDATE,
      payload: newScheduleModel,
    };
  }
}
