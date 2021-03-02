/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import React from "react";
import ShiftTab from "./shifts-tab/shifts-tab.component";
import WorkersTab from "./workers-tab/workers-tab.component";
import RouteButtonsComponent from "../common-components/route-buttons/route-buttons.component";

interface TabData {
  label: string;
  component: JSX.Element;
}

export default function ManagementPage(): JSX.Element {
  const tabs: TabData[] = [
    { label: "PRACOWNICY", component: <WorkersTab /> },
    { label: "ZMIANY", component: <ShiftTab /> },
  ];
  return (
    <div className="management-page">
      <h1>Panel zarządzania</h1>
      <RouteButtonsComponent id="adjusted-tab-padding" tabs={tabs} />
    </div>
  );
}
