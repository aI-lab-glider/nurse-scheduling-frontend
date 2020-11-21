import React from "react";
import { TableComponent } from "./table/table.component";
import { ToolbarComponent } from "./toolbar.component";

export default function SchedulePage(): JSX.Element {
  return (
    <React.Fragment>
      <div className="header">
        <ToolbarComponent />
      </div>
      <div className="cols-3-to-1">
        <TableComponent />
      </div>
    </React.Fragment>
  );
}
