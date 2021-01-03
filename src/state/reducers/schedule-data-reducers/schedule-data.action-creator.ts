import { ThunkFunction } from "../../../api/persistance-store.model";
import { ScheduleDataModel } from "../../../common-models/schedule-data.model";
import { ActualRevisionActionType } from "./actual-revision.reducer";
import { ScheduleActionModel, ScheduleDataActionType } from "./schedule-data.reducer";

export interface UndoableConfig {
  undoType: string;
  redoType: string;
}

export class UndoActionCreator {
  static undo(config: UndoableConfig): ScheduleActionModel {
    return {
      type: config.undoType,
    };
  }
  static redo(config: UndoableConfig): ScheduleActionModel {
    return {
      type: config.redoType,
    };
  }
}

export class ScheduleDataActionCreator {
  static addNewSchedule(newSchedule: ScheduleDataModel): ThunkFunction<ScheduleDataModel> {
    return async (dispatch): Promise<void> => {
      const setEditableSchedule = {
        type: ScheduleDataActionType.ADD_NEW,
        payload: newSchedule,
      };
      const setActualRevision = {
        type: ActualRevisionActionType.SET_REVISION,
        payload: newSchedule,
      };
      dispatch(setActualRevision);
      dispatch(setEditableSchedule);
    };
  }

  static updateSchedule(newScheduleModel: ScheduleDataModel): ScheduleActionModel {
    return {
      type: ScheduleDataActionType.UPDATE,
      payload: newScheduleModel,
    };
  }
}
