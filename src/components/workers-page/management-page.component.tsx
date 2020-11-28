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
    { label: "Pracownicy", component: <WorkersTab /> },
    { label: "Zmiany", component: <ShiftTab /> },
    { label: "Ograniczenia", component: <ConstraintTab /> },
  ];

  return (
    <div className="management-page">
      <h1>Panel zarządzania</h1>
      <RouteButtonsComponent tabs={tabs} />
    </div>
  );
}
