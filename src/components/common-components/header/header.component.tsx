import React from "react";
import { MonthSwitchComponent } from "../month-switch/month-switch.component";
import AssignmentIndIcon from "@material-ui/icons/AssignmentInd";
import { Button } from "../button-component/button.component";
import { Link } from "react-router-dom";

interface HeaderCheckInterface {
  isNewMonthPage: boolean;
}

export function HeaderComponent({ isNewMonthPage }: HeaderCheckInterface): JSX.Element {
  return (
    <>
      <div id={"header"}>
        <AssignmentIndIcon id={"AssignmentIndIcon"} />
        {isNewMonthPage && (
          <Link to="/">
            <Button size="small" className="submit-button returnToNowBtn" variant="secondary">
              Wróć do teraz
            </Button>
          </Link>
        )}
        <div className={"filler"} />
        <MonthSwitchComponent />
        <div className={"filler"} />
      </div>
    </>
  );
}
