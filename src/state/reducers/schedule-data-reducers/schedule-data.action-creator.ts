import { ThunkFunction } from "../../../api/persistance-store.model";
import { ScheduleDataModel } from "../../../common-models/schedule-data.model";
import { ActualRevisionActionType } from "./actual-revision.reducer";
import { ScheduleActionModel, ScheduleDataActionType } from "./schedule-data.reducer";

export interface UndoableConfig<T> {
  undoType: string;
  redoType: string;
  afterUndo?: ThunkFunction<T>;
  afterRedo?: ThunkFunction<T>;
}

export class UndoActionCreator {
  static undo({ undoType, afterUndo }: UndoableConfig<unknown>): ThunkFunction<unknown> {
    return async (dispatch, getState) => {
      dispatch({
        type: undoType,
      });
      await afterUndo?.(dispatch, getState);
    };
  }
  static redo({ redoType, afterRedo }: UndoableConfig<unknown>): ThunkFunction<unknown> {
    return async (dispatch, getState) => {
      dispatch({
        type: redoType,
      });
      await afterRedo?.(dispatch, getState);
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
