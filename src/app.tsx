import React from "react";
import { CustomGlobalHotKeys, HeaderComponent } from "./components/common-components";
import { ToolbarViewingComponent } from "./components/schedule-page/toolbar/toolbar-viewing.component";
import { Route, Switch } from "react-router-dom";
import { ToolbarEditingComponent } from "./components/schedule-page/toolbar/toolbar-editing.component";

function App(): JSX.Element {
  return (
    <React.Fragment>
      <div>
        <CustomGlobalHotKeys />
        <HeaderComponent />
        <Switch>
          <Route path="/" component={ToolbarViewingComponent} exact />
          <Route path="/schedule-editing" component={ToolbarEditingComponent} />
        </Switch>
      </div>
    </React.Fragment>
  );
}

export default App;
