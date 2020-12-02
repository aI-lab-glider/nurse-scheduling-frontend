import React from "react";
import { TableComponent } from "./table/table.component";

export default function SchedulePage(): JSX.Element {
  return (
    <React.Fragment>
      <div className="cols-3-to-1">
        <TableComponent />
      </div>
    </React.Fragment>
  );
}
