import React from "react";
import { ImportButtonsComponent } from "./import-buttons/import-buttons.component";
import { ProblemMetadataComponent } from "./problem-metadata/problem-metadata.component";
import "./toolbar.component.css";
import ValidationDrawerComponent from "./validation-window-button/validation-window-button.component";

export function ToolbarComponent() {
  return (
    <div className="header">
      <ImportButtonsComponent />
      <ValidationDrawerComponent />
      <ProblemMetadataComponent />
    </div>
  );
}
