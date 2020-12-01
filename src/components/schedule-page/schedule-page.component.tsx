import React from "react";
import { TableComponent } from "./table/table.component";
import { ToolbarComponent } from "./toolbar.component";

export default function SchedulePage(): JSX.Element {
  return (
    <React.Fragment>
      <div>
        <ToolbarComponent />
      </div>
      <div>
        <TableComponent />
      </div>
    </React.Fragment>
  );
}
