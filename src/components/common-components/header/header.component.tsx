/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import AssignmentIndIcon from "@material-ui/icons/AssignmentInd";
import React, { useCallback, useContext, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ApplicationStateModel } from "../../../state/models/application-state.model";
import { MonthSwitchActionCreator } from "../../../state/reducers/month-state/schedule-data/month-switch.action-creator";
import { Button } from "../button-component/button.component";
import { MonthSwitchComponent } from "../month-switch/month-switch.component";
import classNames from "classnames/bind";
import { Button as MaterialButton } from "@material-ui/core";
import ReportIssueModal from "../modal/report-issue-modal/report-issue-modal.component";
import SettingsIcon from "@material-ui/icons/Settings";
import HelpOutlineIcon from "@material-ui/icons/HelpOutline";
import { AppConfigContext, AppConfigOptions, AppMode } from "../../../state/app-config-context";
import { ScheduleMode } from "../../schedule-page/table/schedule/schedule-state.model";

function monthDiff(d1: Date, d2: Date): number {
  let months: number;
  months = (d2.getFullYear() - d1.getFullYear()) * 12;
  months -= d1.getMonth();
  months += d2.getMonth();
  return months;
}

export function HeaderComponent(): JSX.Element {
  const applicationStateModel = useSelector((state: ApplicationStateModel) => state.actualState)
    .mode;
  const appConfigContext = useAppConfig().mode;

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
  const isInViewMode = applicationStateModel === ScheduleMode.Readonly;
  const [isModalOpen, setIsModalOpen] = useState(false);

  function onReportIssueClick(): void {
    setIsModalOpen(true);
  }

  function useAppConfig(): AppConfigOptions {
    const context = useContext(AppConfigContext);

    if (!context) throw new Error("useAppConfig have to be used within AppConfigProvider");

    return context;
  }
  const [showNowNavigation, setShowNowNavigation] = useState(false);

  useEffect(() => {
    appConfigContext === AppMode.SCHEDULE
      ? setShowNowNavigation(isInViewMode)
      : setShowNowNavigation(false);
  }, [appConfigContext, isInViewMode]);

  const redirectToDocumentation = useCallback((): void => {
    window.open(process.env.REACT_APP_HELP_PAGE_URL);
  }, []);

  return (
    <>
      <div id={"header"}>
        <AssignmentIndIcon id={"AssignmentIndIcon"} />
        <Button
          className={classNames("submit-button", "returnToNowBtn", {
            hidden: !isNewMonth || !showNowNavigation,
          })}
          variant="secondary"
          onClick={returnToCurrentMonth}
          disabled={!isNewMonth || !showNowNavigation}
        >
          Wróć do teraz
        </Button>
        <div className={"filler"} />
        <MonthSwitchComponent isInViewMode={isInViewMode} />
        <div className={"filler"} />
        <MaterialButton className={"reportIssueLink"} onClick={onReportIssueClick}>
          Zgłoś błąd
        </MaterialButton>
        <ReportIssueModal open={isModalOpen} setOpen={setIsModalOpen} />
        <SettingsIcon className="header-icon" />
        <HelpOutlineIcon className="header-icon" onClick={redirectToDocumentation} />
      </div>
    </>
  );
}
