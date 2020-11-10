import React from "react";
import { TableComponent } from "./components/table/table.component";
import { ToolbarComponent } from "./components/toolbar/toolbar.component";
import { GlobalHotKeys } from "react-hotkeys";
import { ActionCreators as UndoActionCreators } from "redux-undo";
import { useDispatch } from "react-redux";

function App(): JSX.Element {
  const keyMap = {
    UNDO: "ctrl+z",
    REDO: "ctrl+shift+z",
  };

  const dispatch = useDispatch();
  const globalHandlers = {
    UNDO: () => dispatch(UndoActionCreators.undo()),
    REDO: () => dispatch(UndoActionCreators.redo()),
  };

  return (
    <React.Fragment>
      <GlobalHotKeys keyMap={keyMap} handlers={globalHandlers} />
      <div className="header">
        <ToolbarComponent />
      </div>
      <div className="cols-3-to-1">
        <TableComponent />
      </div>
    </React.Fragment>
  );
}

export default App;
