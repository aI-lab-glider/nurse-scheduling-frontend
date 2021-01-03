import { ThunkFunction } from "../../api/persistance-store.model";

export interface UndoableConfig<T> {
  undoType: string;
  redoType: string;
  afterUndo?: ThunkFunction<T>;
  afterRedo?: ThunkFunction<T>;
}

export class UndoActionCreator {
  static undo({ undoType, afterUndo }: UndoableConfig<unknown>): ThunkFunction<unknown> {
    return async (dispatch, getState): Promise<void> => {
      dispatch({
        type: undoType,
      });
      await afterUndo?.(dispatch, getState);
    };
  }
  static redo({ redoType, afterRedo }: UndoableConfig<unknown>): ThunkFunction<unknown> {
    return async (dispatch, getState): Promise<void> => {
      dispatch({
        type: redoType,
      });
      await afterRedo?.(dispatch, getState);
    };
  }
}
