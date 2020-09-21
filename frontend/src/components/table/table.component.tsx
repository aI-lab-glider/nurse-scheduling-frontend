import React from "react";
import LegendComponent from "./legend/legend-component";
import { ScheduleComponent } from "./schedule/schedule.component";
import "./table.component.css";

export function TableComponent() {
  return (
    <div className="table">
      <ScheduleComponent />
      <LegendComponent />
    </div>
  );
}
