import React, { useState } from "react";
import { ToolbarEditingComponent } from "./toolbar-editing.component";
import { ToolbarViewingComponent } from "./toolbar-viewing.component";

export function ToolbarComponent(props): JSX.Element {
  const [editMode, setEditMode] = useState<boolean>(false);

  return (
    <div className="toolbar-container">
      {editMode ? (
        <ToolbarEditingComponent editModeChange={setEditMode} />
      ) : (
        <ToolbarViewingComponent editModeChange={setEditMode} />
      )}
    </div>
  );
}
