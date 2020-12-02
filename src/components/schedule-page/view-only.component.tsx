import React from "react";
import { Route, Switch } from "react-router-dom";
import { ScheduleViewingComponent } from "./toolbar/schedule-viewing.component";
import { ScheduleEditingComponent } from "./toolbar/schedule-editing.component";

export default function ViewOnlyComponent(): JSX.Element {
  return (
    <React.Fragment>
      <div className="cols-3-to-1">
        <Switch>
          <Route path="/" component={ScheduleViewingComponent} exact />
          <Route path="/schedule-editing" component={ScheduleEditingComponent} />
        </Switch>
      </div>
    </React.Fragment>
  );
}
