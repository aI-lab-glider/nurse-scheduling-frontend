import React from "react";
import SchedulePage from "./components/schedule-page/schedule-page.component";
import ManagementPage from "./components/workers-page/management-page.component";
import { CustomGlobalHotKeys } from "./components/common-components/tools/globalhotkeys.component";
import HeaderComponent from "./components/common-components/header/header.component";
import RouteButtonsComponent from "./components/common-components/route-buttons/route-buttons.component";

interface TabData {
  label: string;
  component: JSX.Element;
}

const tabs: TabData[] = [
  { label: "Plan", component: <SchedulePage /> },
  { label: "Zarządzanie", component: <ManagementPage /> },
];

function App(): JSX.Element {
  return (
    <React.Fragment>
      <CustomGlobalHotKeys />
      <HeaderComponent />
      <RouteButtonsComponent tabs={tabs} />
    </React.Fragment>
  );
}

export default App;
