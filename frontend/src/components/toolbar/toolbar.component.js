import React from "react";
import { ImportButtonsComponent } from "./import-buttons/index";
import ProblemMetadataComponent from "./problem-metadata";
import "./toolbar.component.css";

function ToolbarComponent() {
  return (
    <div className="header">
      <ImportButtonsComponent />
      <ProblemMetadataComponent />
    </div>
  );
}

export default ToolbarComponent;
