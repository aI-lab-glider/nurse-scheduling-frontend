import React from "react";
import { MonthSwitchComponent } from "../../common-components";
import { ImportButtonsComponent } from "../import-buttons/import-buttons.component";
import ValidationDrawerComponent from "../validation-drawer/validation-drawer.component";

export function ToolbarEditingComponent(): JSX.Element {
  return (
    <div className="toolbar-container">
      <ImportButtonsComponent />
      <ValidationDrawerComponent />
      <MonthSwitchComponent />
    </div>
  );
}
