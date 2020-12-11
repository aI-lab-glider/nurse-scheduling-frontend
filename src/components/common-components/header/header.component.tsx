import React from "react";
import { MonthSwitchComponent } from "../month-switch/month-switch.component";
import AssignmentIndIcon from "@material-ui/icons/AssignmentInd";

export function HeaderComponent(): JSX.Element {
  return (
    <>
      <div id={"header"}>
        <AssignmentIndIcon id={"AssignmentIndIcon"} />
        <div className={"filler"} />
        <MonthSwitchComponent />
        <div className={"filler"} />
      </div>
    </>
  );
}
