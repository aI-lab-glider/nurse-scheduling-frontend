/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import { Button as MaterialButton } from "@material-ui/core";
import AssignmentIndIcon from "@material-ui/icons/AssignmentInd";
import HelpOutlineIcon from "@material-ui/icons/HelpOutline";
import SettingsIcon from "@material-ui/icons/Settings";
import React, { useCallback, useContext, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import styled from "styled-components";
import { colors, fontSizeBase } from "../../assets/colors";
import { t } from "../../helpers/translations.helper";
import { AppConfigContext, AppConfigOptions, AppMode } from "../../state/app-config-context";
import { ApplicationStateModel } from "../../state/application-state.model";
import { MonthSwitchActionCreator } from "../../state/schedule-data/month-switch.action-creator";
import { Button } from "../buttons/button-component/button.component";
import ReportIssueModal from "../modals/report-issue-modal/report-issue-modal.component";
import { MonthSwitchComponent } from "../month-switch/month-switch.component";
import { ScheduleMode } from "../schedule/schedule-state.model";

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
    <Header id="header">
      <Logo />
      <ReturnToNowBtn
        data-cy="return-to-now"
        hidden={!isNewMonth || !showNowNavigation}
        variant="secondary"
        onClick={returnToCurrentMonth}
      >
        {t("returnToNow")}
      </ReturnToNowBtn>
      <Filler />
      <MonthSwitchComponent isInViewMode={isInViewMode} />
      <Filler />
      <ReportIssueBtn onClick={onReportIssueClick}>{t("reportError")}</ReportIssueBtn>
      <ReportIssueModal open={isModalOpen} setOpen={setIsModalOpen} />
      <Settings />
      <Help onClick={redirectToDocumentation} />
    </Header>
  );
}

const Header = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
  height: 52px;
  background-color: ${colors.primary};
  padding: 0 20px 0 20px;
  align-items: center;
  justify-content: space-around;
  position: fixed;
  top: 0;
  z-index: 2;
`;

const ReturnToNowBtn = styled(Button)`
  margin-top: 0;
  font-size: ${fontSizeBase};
  padding: 0 10px;
  margin-bottom: 0;
`;

const Settings = styled(SettingsIcon)`
  color: ${colors.white};
`;

const Help = styled(HelpOutlineIcon)`
  margin: auto 5px;
  cursor: pointer;
  color: ${colors.white};
`;

const Logo = styled(AssignmentIndIcon)`
  color: ${colors.white};
`;

const Filler = styled.div`
  flex-grow: 1;
`;

const ReportIssueBtn = styled(MaterialButton)`
  color: ${colors.white};
  padding-right: 5px;
  letter-spacing: 0.75px;
  outline: none;
  text-transform: none;
  &:hover {
    text-decoration: underline;
    transform: none;
  }
`;
