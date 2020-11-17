import React from "react";
import { TableComponent } from "./components/table/table.component";
import { ToolbarComponent } from "./components/toolbar/toolbar.component";
import { CustomGlobalHotKeys } from "./components/tools/globalhotkeys.component";

function App(): JSX.Element {
  return (
    <React.Fragment>
      <CustomGlobalHotKeys />
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
