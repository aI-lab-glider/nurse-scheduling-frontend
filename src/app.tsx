import { Route, Switch } from "react-router-dom";
import React from "react";
import SchedulePage from "./components/schedule-page/schedule-page.component";
import WorkersPage from "./components/workers-page/workers-page.component";
import { CustomGlobalHotKeys } from "./components/common-components/tools/globalhotkeys.component";

function App(): JSX.Element {
  return (
    <React.Fragment>
      <CustomGlobalHotKeys />
      <Switch>
        <Route path="/" component={SchedulePage} exact />
        <Route path="/workers" component={WorkersPage} />
      </Switch>
    </React.Fragment>
  );
}

export default App;
