import React from "react";
import { Route, Switch } from "react-router-dom";
import { CustomGlobalHotKeys, HeaderComponent } from "./components/common-components";
import { ViewOnlyComponent } from "./components/view-only.component";
import { ScheduleEditingComponent } from "./components/schedule-page/schedule-editing.component";

function App(): JSX.Element {
  return (
    <React.Fragment>
      <div>
        <CustomGlobalHotKeys />
        <HeaderComponent />
        <Switch>
          <Route path="/" component={ViewOnlyComponent} exact />
          <Route path="/schedule-editing" component={ScheduleEditingComponent} />
        </Switch>
      </div>
    </React.Fragment>
  );
}

export default App;
