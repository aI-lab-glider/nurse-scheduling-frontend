import React from "react";
import { ImportButtonsComponent } from "./import-buttons/import-buttons.component";
import { ProblemMetadataComponent } from "./problem-metadata/problem-metadata.component";
// import "./toolbar.component.css";
import ValidationDrawerComponent from "./validation-drawer/validation-drawer.component";

export function ToolbarComponent(): JSX.Element {
  return (
    <div className="toolbar-container">
      <ImportButtonsComponent />
      <ValidationDrawerComponent />
      <ProblemMetadataComponent />
    </div>
  );
}
