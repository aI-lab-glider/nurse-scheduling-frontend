import React from "react";
import { ScheduleComponent } from "./schedule/schedule.component";
import "./table.component.css";

export function TableComponent() {
  return (
    <div className="table-container">
      <ScheduleComponent />
    </div>
  );
}
