import React from "react";
import { ScheduleComponent } from "./schedule/schedule.component";
// import "./table.component.css";

export function TableComponent(): JSX.Element {
  return (
    <div className="table-container">
      <ScheduleComponent />
    </div>
  );
}
