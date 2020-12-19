import React from "react";
import { ScheduleComponentState } from "../schedule-page/table/schedule/schedule-state.model";
import { TimeTableSection } from "./timetable-section.component";
export interface TimeTableComponentOptions {
  scheduleLocalState: ScheduleComponentState;
}

export function TimeTableComponent(options: TimeTableComponentOptions): JSX.Element {
  return (
    <div>
      <TimeTableSection scheduleLocalState={options.scheduleLocalState} />
    </div>
  );
}
