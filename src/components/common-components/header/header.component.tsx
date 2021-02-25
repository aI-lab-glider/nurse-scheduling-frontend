/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import AssignmentIndIcon from "@material-ui/icons/AssignmentInd";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ApplicationStateModel } from "../../../state/models/application-state.model";
import { MonthSwitchActionCreator } from "../../../state/reducers/month-state/schedule-data/month-switch.action-creator";
import { Button } from "../button-component/button.component";
import { MonthSwitchComponent } from "../month-switch/month-switch.component";
import classNames from "classnames/bind";
import { Button as MaterialButton } from "@material-ui/core";
import ReportIssueModal from "../modal/report-issue-modal/report-issue-modal.component";
import SettingsIcon from "@material-ui/icons/Settings";

function monthDiff(d1: Date, d2: Date): number {
  let months: number;
  months = (d2.getFullYear() - d1.getFullYear()) * 12;
  months -= d1.getMonth();
  months += d2.getMonth();
  return months;
}

export function HeaderComponent(): JSX.Element {
  const { mode } = useSelector((state: ApplicationStateModel) => state.actualState);

  const dispatch = useDispatch();
  const { month_number: monthNumber, year } = useSelector(
    (state: ApplicationStateModel) => state.actualState.persistentSchedule.present.schedule_info
  );

  const [isNewMonth, setIsNewMonth] = useState(false);
  useEffect(() => {
    const currentMonth = new Date().getMonth();
    setIsNewMonth(monthNumber !== currentMonth);
  }, [monthNumber]);

  function returnToCurrentMonth(): void {
    const offset = monthDiff(new Date(year, monthNumber), new Date());
    dispatch(MonthSwitchActionCreator.switchToNewMonth(offset));
  }
  const isReadOnlyMode = mode === "readonly";
  const [isModalOpen, setIsModalOpen] = useState(false);

  function onReportIssueClick(): void {
    setIsModalOpen(true);
  }

  return (
    <>
      <div id={"header"}>
        <AssignmentIndIcon id={"AssignmentIndIcon"} />
        <Button
          className={classNames("submit-button", "returnToNowBtn", { hidden: !isNewMonth })}
          variant="secondary"
          onClick={returnToCurrentMonth}
        >
          Wróć do teraz
        </Button>
        <div className={"filler"} />
        <MonthSwitchComponent enableMonthSwitching={isReadOnlyMode} />
        <div className={"filler"} />
        <MaterialButton className={"reportIssueLink"} onClick={onReportIssueClick}>
          Zgłoś błąd
        </MaterialButton>
        <ReportIssueModal open={isModalOpen} setOpen={setIsModalOpen} />
        <SettingsIcon />
      </div>
    </>
  );
}
