import { ThunkFunction } from "../../../../api/persistance-store.model";
import { ScheduleDataModel } from "../../../../common-models/schedule-data.model";
import {
  PERSISTENT_SCHEDULE_NAME,
  ScheduleActionDestination,
  TEMPORARY_SCHEDULE_NAME,
} from "../../../app.reducer";
import { ActionModel } from "../../../models/action.model";
import { HistoryReducerActionCreator } from "../../history.reducer";
import { createActionName } from "./common-reducers";
import { ScheduleActionType } from "./temporary-schedule.reducer";

export type ScheduleActionModel = ActionModel<ScheduleDataModel>;
export class ScheduleDataActionCreator {
  static setPersistentSchedule(newSchedule: ScheduleDataModel): ThunkFunction<ScheduleDataModel> {
    return async (dispatch): Promise<void> => {
      const destinations = [PERSISTENT_SCHEDULE_NAME, TEMPORARY_SCHEDULE_NAME];
      destinations.forEach((destination) => {
        const action = {
          type: createActionName(destination, ScheduleActionType.ADD_NEW),
          payload: newSchedule,
        };
        dispatch(action);
      });
    };
  }

  static copyPreviousMonth(): ThunkFunction<unknown> {
    return async (dispatch, getState): Promise<void> => {
      const actualSchedule = getState().actualState;
      // eslint-disable-next-line @typescript-eslint/camelcase
      const historyAction = HistoryReducerActionCreator.addToHistory(actualSchedule);

      const destinations = [PERSISTENT_SCHEDULE_NAME, TEMPORARY_SCHEDULE_NAME];
      const nextMonth =
        ((actualSchedule.temporarySchedule.present.schedule_info.month_number ?? 0) + 1) % 12;
      destinations.forEach((destination) => {
        const action = {
          type: createActionName(destination, ScheduleActionType.COPY_FROM_MONTH),
          payload: {
            // eslint-disable-next-line @typescript-eslint/camelcase
            month_number: nextMonth,
            year: actualSchedule.temporarySchedule.present.schedule_info.year,
          },
        };
        dispatch(action);
      });
      dispatch(historyAction);
    };
  }

  static addNewSchedule(
    destination: ScheduleActionDestination,
    newSchedule: ScheduleDataModel
  ): ScheduleActionModel {
    return {
      type: createActionName(destination, ScheduleActionType.ADD_NEW),
      payload: newSchedule,
    };
  }

  static updateSchedule(newScheduleModel: ScheduleDataModel): ScheduleActionModel {
    return {
      type: createActionName(TEMPORARY_SCHEDULE_NAME, ScheduleActionType.UPDATE),
      payload: newScheduleModel,
    };
  }
}
