/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import React from "react";
import ShiftTab from "./shifts-tab/shifts-tab.component";
import WorkersTab from "./workers-tab/workers-tab.component";
import RouteButtonsComponent, {
  Tabs,
} from "../common-components/route-buttons/route-buttons.component";

export default function ManagementPage(): JSX.Element {
  const tabs: Tabs[] = [
    { label: "PRACOWNICY", component: <WorkersTab />, dataCy: "btn-workers-tab" },
    { label: "ZMIANY", component: <ShiftTab />, dataCy: "btn-shifts-tab" },
  ];
  return (
    <div className="management-page">
      <h1 data-cy={"management-page-title"}>Panel zarządzania</h1>
      <RouteButtonsComponent id="adjusted-tab-padding" tabs={tabs} />
    </div>
  );
}
