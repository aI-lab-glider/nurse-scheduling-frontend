/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import React from "react";
import ShiftTab from "./shifts-tab/shifts-tab.component";
import ConstraintTab from "./constraints-tab/constraints-tab.component";
import WorkersTab from "./workers-tab/workers-tab.component";
import RouteButtonsComponent from "../common-components/route-buttons/route-buttons.component";
import { useScheduleMargin } from "../schedule-page/schedule-margin-context/schedule-margin-context";

interface TabData {
  label: string;
  component: JSX.Element;
}

export default function ManagementPage(): JSX.Element {
  const tabs: TabData[] = [
    { label: "PRACOWNICY", component: <WorkersTab /> },
    { label: "ZMIANY", component: <ShiftTab /> },
    { label: "OGRANICZENIA", component: <ConstraintTab /> },
  ];
  const { scheduleMargin } = useScheduleMargin();

  return (
    <div className="management-page" style={{ padding: `0px ${scheduleMargin}` }}>
      <h1>Panel zarządzania</h1>
      <RouteButtonsComponent id="adjusted-tab-padding" tabs={tabs} fullWidth={true} />
    </div>
  );
}
