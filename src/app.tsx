import React from "react";
import SchedulePage from "./components/schedule-page/schedule-page.component";
import ManagementPage from "./components/workers-page/management-page.component";
import { CustomGlobalHotKeys } from "./components/common-components/tools/globalhotkeys.component";
import HeaderComponent from "./components/common-components/header/header.component";
import RouteButtonsComponent from "./components/common-components/route-buttons/route-buttons.component";

const routes = { Plan: SchedulePage, Zarządzanie: ManagementPage };

function App(): JSX.Element {
  return (
    <React.Fragment>
      <CustomGlobalHotKeys />
      <HeaderComponent />
      <RouteButtonsComponent components={routes} />
    </React.Fragment>
  );
}

export default App;
