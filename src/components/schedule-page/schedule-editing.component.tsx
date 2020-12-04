import React from "react";
import { EditToolbarComponent } from "./toolbar/edit-toolbar.component";

export function ScheduleEditingComponent(): JSX.Element {
  return (
    <div className="toolbar-container">
      <EditToolbarComponent />
    </div>
  );
}
