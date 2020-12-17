import React from "react";
import { ScheduleComponent } from "../table/schedule/schedule.component";
import { EditPageToolbar } from "./edit-page-toolbar.component";

interface ScheduleEditPageOptions {
  closeEdit: () => void;
}

export function ScheduleEditPage(options: ScheduleEditPageOptions): JSX.Element {
  return (
    <div id="edit-page">
      <EditPageToolbar closeEdit={options.closeEdit} />
      <div className="schedule">
        <ScheduleComponent />
      </div>
    </div>
  );
}
