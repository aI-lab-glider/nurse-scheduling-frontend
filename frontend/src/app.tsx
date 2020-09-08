import React from "react";
import "./app.css";
import { TableComponent } from "./components/table/table.component";
import { ToolbarComponent } from "./components/toolbar/toolbar.component";
import { ValidationWindowComponent } from "./components/validation-window/validation-window.component";
function App() {
  return (
    <React.Fragment>
      <div className="header">
        <ToolbarComponent />
      </div>
      <div className="cols-3-to-1">
        <TableComponent />
        <ValidationWindowComponent />
      </div>
    </React.Fragment>
  );
}

export default App;
