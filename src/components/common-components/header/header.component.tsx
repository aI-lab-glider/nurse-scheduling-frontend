/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import React from "react";
import { MonthSwitchComponent } from "../month-switch/month-switch.component";
import AssignmentIndIcon from "@material-ui/icons/AssignmentInd";
import { Button } from "../button-component/button.component";
import { Link } from "react-router-dom";
import { useScheduleMargin } from "../../schedule-page/schedule-margin-context/schedule-margin-context";

interface HeaderCheckInterface {
  isNewMonthPage: boolean;
}

export function HeaderComponent({ isNewMonthPage }: HeaderCheckInterface): JSX.Element {
  const { scheduleMargin } = useScheduleMargin();
  const marginSize = parseFloat(scheduleMargin.substring(0, scheduleMargin.length - 2));

  return (
    <div id={"header"} style={{ padding: `0px ${marginSize + 20}px` }}>
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
  );
}
