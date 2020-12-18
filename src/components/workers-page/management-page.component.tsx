import React from "react";
import ShiftTab from "./shifts-tab/shifts-tab.component";
import ConstraintTab from "./constraints-tab/constraints-tab.component";
import WorkersTab from "./workers-tab/workers-tab.component";
import RouteButtonsComponent from "../common-components/route-buttons/route-buttons.component";

interface TabData {
  label: string;
  component: JSX.Element;
}

export default function ManagementPage(): JSX.Element {
  const tabs: TabData[] = [
    { label: "Pracownicy".toUpperCase(), component: <WorkersTab /> },
    { label: "Zmiany".toUpperCase(), component: <ShiftTab /> },
    { label: "Ograniczenia".toUpperCase(), component: <ConstraintTab /> },
  ];

  return (
    <div className="management-page">
      <h1>Panel zarządzania</h1>
      <RouteButtonsComponent id="adjusted-tab-padding" tabs={tabs} />
    </div>
  );
}
