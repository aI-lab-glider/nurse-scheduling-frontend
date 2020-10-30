import React from "react";
import { ScheduleComponent } from "./schedule/schedule.component";

export function TableComponent(): JSX.Element {
  return (
    <div className="table-container">
      <ScheduleComponent />
    </div>
  );
}
