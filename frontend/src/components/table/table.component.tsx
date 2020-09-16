import React from "react";
import LegendComponent from "./legend/legend-component";
import ListComponent from "./list/list.component";
import "./table.component.css";
export function TableComponent() {
  return (
    <div className="table">
      <ListComponent />
      <LegendComponent />
    </div>
  );
}
