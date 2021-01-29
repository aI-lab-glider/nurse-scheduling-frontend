/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import React, { useState } from "react";
import { MonthSwitchComponent } from "../month-switch/month-switch.component";
import AssignmentIndIcon from "@material-ui/icons/AssignmentInd";
import { Button } from "../button-component/button.component";
import { Link } from "react-router-dom";
import { useScreenshot } from "use-screenshot-hook";
import ReportIssueModal from "../modal/report-issue-modal/report-issue-modal.component";
import { Typography } from "@material-ui/core";
import SettingsIcon from "@material-ui/icons/Settings";

interface HeaderCheckInterface {
  isNewMonthPage: boolean;
}

export function HeaderComponent({ isNewMonthPage }: HeaderCheckInterface): JSX.Element {
  const [modalOpen, modalSetOpen] = useState(false);
  const { image, takeScreenshot } = useScreenshot();

  function onReportIssueClick(): void {
    takeScreenshot();
    modalSetOpen(true);
  }

  return (
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
      <Link onClick={(): void => onReportIssueClick()}>
        <Typography className={"reportIssueLink"}>
          Zgłoś błąd
          <SettingsIcon />
        </Typography>
      </Link>
      <ReportIssueModal open={modalOpen} setOpen={modalSetOpen} screenshot={image} />
    </div>
  );
}
