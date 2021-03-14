/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import { ThunkFunction } from "../../api/persistance-store.model";
import { ActionModel } from "../models/action.model";

export interface UndoableConfig<T> {
  undoType: string;
  redoType: string;
  clearHistoryType: string;
  afterUndo?: ThunkFunction<T>;
  afterRedo?: ThunkFunction<T>;
}

export class UndoActionCreator {
  static undo({ undoType, afterUndo }: UndoableConfig<unknown>): ThunkFunction<unknown> {
    return async (dispatch, getState): Promise<void> => {
      if (getState().actualState.temporarySchedule.past.length === 1) {
        return;
      }
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

  static clearHistory({ clearHistoryType }: UndoableConfig<unknown>): ActionModel<unknown> {
    return {
      type: clearHistoryType,
    };
  }
}
