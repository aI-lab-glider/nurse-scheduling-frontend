import { Route, Switch } from "react-router-dom";
import React from "react";
import SchedulePage from "./components/schedule-page/schedule-page.component";
import WorkersPage from "./components/workers-page/management-page.component";
import { CustomGlobalHotKeys } from "./components/common-components/tools/globalhotkeys.component";
import Header from "./components/common-components/header/header";

function App(): JSX.Element {
  return (
    <React.Fragment>
      <CustomGlobalHotKeys />
      <Header />
      <Switch>
        <Route path="/" component={SchedulePage} exact />
        <Route path="/management" component={WorkersPage} />
      </Switch>
    </React.Fragment>
  );
}

export default App;
