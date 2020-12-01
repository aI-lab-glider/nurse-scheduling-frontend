import React from "react";
import { ToolbarEditingComponent } from "./toolbar-editing.component";
import { ToolbarViewingComponent } from "./toolbar-viewing.component";

export function ToolbarComponent(props): JSX.Element {
  const EditMode = props.EditMode;

  return (
    <div className="toolbar-container" style={{ width: "100%" }}>
      {EditMode ? <ToolbarEditingComponent /> : <ToolbarViewingComponent />}
    </div>
  );
}
