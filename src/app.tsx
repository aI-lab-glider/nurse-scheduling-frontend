import React, { useEffect } from "react";
import { Route, Switch } from "react-router-dom";
import { CustomGlobalHotKeys, HeaderComponent } from "./components/common-components";
import { ViewOnlyComponent } from "./components/view-only.component";
import { ScheduleEditingComponent } from "./components/schedule-page/schedule-editing.component";
import { useDispatch } from "react-redux";
import schedule from "./assets/devMode/schedule.js";
import { ScheduleDataActionType } from "./state/reducers/schedule-data.reducer";
import { ActionModel } from "./state/models/action.model";
import { ScheduleDataModel } from "./common-models/schedule-data.model";

function App() {
  const scheduleDispatcher = useDispatch();
  useEffect(() => {
    if (process.env.REACT_APP_DEV_MODE === "true") {
      scheduleDispatcher({
        type: ScheduleDataActionType.ADD_NEW,
        payload: schedule,
      } as ActionModel<ScheduleDataModel>);
    }
  }, [scheduleDispatcher]);

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
