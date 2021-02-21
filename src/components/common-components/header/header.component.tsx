/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import React, { useState } from "react";
import { MonthSwitchComponent } from "../month-switch/month-switch.component";
import AssignmentIndIcon from "@material-ui/icons/AssignmentInd";
import { Button } from "../button-component/button.component";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { ApplicationStateModel } from "../../../state/models/application-state.model";
import { useScreenshot } from "use-screenshot-hook";
import ReportIssueModal from "../modal/report-issue-modal/report-issue-modal.component";
import { Typography } from "@material-ui/core";
import SettingsIcon from "@material-ui/icons/Settings";

interface HeaderCheckInterface {
  isNewMonthPage: boolean;
}

export function HeaderComponent({ isNewMonthPage }: HeaderCheckInterface): JSX.Element {
  const { mode } = useSelector((state: ApplicationStateModel) => state.actualState);
  const isReadOnlyMode = mode === "readonly";
  const [modalOpen, modalSetOpen] = useState(false);
  const { image, takeScreenshot, clear } = useScreenshot();

  function onReportIssueClick(): void {
    takeScreenshot();
    modalSetOpen(true);
  }

  return (
    <>
      <div id={"header"}>
        <AssignmentIndIcon id={"AssignmentIndIcon"} />
        {isNewMonthPage && (
          <Link to="/">
            <Button className="submit-button returnToNowBtn" variant="secondary">
              Wróć do teraz
            </Button>
          </Link>
        )}
        <div className={"filler"} />
        {isReadOnlyMode && <MonthSwitchComponent />}
        <div className={"filler"} />
        <Link onClick={(): void => onReportIssueClick()}>
          <Typography className={"reportIssueLink"}>Zgłoś błąd</Typography>
        </Link>
        <ReportIssueModal
          open={modalOpen}
          setOpen={modalSetOpen}
          screenshot={image}
          clear={clear}
        />
        <SettingsIcon />
      </div>
    </>
  );
}
