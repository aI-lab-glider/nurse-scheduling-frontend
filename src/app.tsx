import { Route, Switch } from "react-router-dom";
import React from "react";
import SchedulePage from "./components/schedule-page/schedule-page.component";
import ManagementPage from "./components/workers-page/management-page.component";
import { CustomGlobalHotKeys } from "./components/common-components/tools/globalhotkeys.component";
import Header from "./components/common-components/header/header";
import RouteButtonsComponent from "./components/common-components/route-buttons/route-buttons.component";

const routes = { Plan: SchedulePage, Zarządzanie: WorkersPage };

function App(): JSX.Element {
  return (
    <React.Fragment>
      <CustomGlobalHotKeys />
      <Header />
      <RouteButtonsComponent components={routes} />
    </React.Fragment>
  );
}

export default App;
