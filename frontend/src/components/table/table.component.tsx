import React from "react";
import LegendComponent from "./legend/legend-component";
import ListComponent from "./list/list.component";

export function TableComponent() {
  return (
    <div>
      <ListComponent />
      <LegendComponent />
    </div>
  );
}
