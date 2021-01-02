import { GlobalHotKeys } from "react-hotkeys";
import React from "react";
import { useDispatch } from "react-redux";
import { ActionCreators as UndoActionCreators } from "redux-undo";

// TODO: Add integration based on actual schedule mode
export function CustomGlobalHotKeys(): JSX.Element {
  const dispatch = useDispatch();

  enum KeyMapActions {
    UNDO,
    REDO,
  }

  const keyMap: Record<KeyMapActions, string> = {
    [KeyMapActions.UNDO]: "ctrl+z",
    [KeyMapActions.REDO]: "ctrl+shift+z",
  };

  const handlers: Record<KeyMapActions, (keyEvent?: KeyboardEvent) => void> = {
    [KeyMapActions.UNDO]: () => dispatch(UndoActionCreators.undo()),
    [KeyMapActions.REDO]: () => dispatch(UndoActionCreators.redo()),
  };

  return <GlobalHotKeys keyMap={keyMap} handlers={handlers} />;
}
