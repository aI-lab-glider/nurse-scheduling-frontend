import React, { useEffect, useState } from "react";
import { CustomGlobalHotKeys, HeaderComponent } from "./components/common-components";
import { SchedulePage } from "./components/schedule-page/schedule-page.component";
import { useDispatch, useSelector } from "react-redux";
import schedule from "./assets/devMode/schedule.js";
import { ScheduleDataActionType } from "./state/reducers/schedule-data.reducer";
import { ActionModel } from "./state/models/action.model";
import { ScheduleDataModel } from "./common-models/schedule-data.model";
import ManagementPage from "./components/workers-page/management-page.component";
import RouteButtonsComponent from "./components/common-components/route-buttons/route-buttons.component";
import { Route, Switch } from "react-router-dom";
import { NewMonthPlanComponent } from "./components/schedule-page/new-month-page.component";

interface TabData {
  label: string;
  component: JSX.Element;
}

function App(): JSX.Element {
  const scheduleDispatcher = useDispatch();
  const [editMode, setEditMode] = useState<boolean>(false);

  const tabs: TabData[] = [
    { label: "Plan", component: <SchedulePage editModeHandler={setEditMode} /> },
    { label: "Zarządzanie", component: <ManagementPage /> },
  ];

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
        <Switch>
          <Route path="/next-month">
            <HeaderComponent isNewMonthPage={true} />
            <NewMonthPlanComponent />
          </Route>
          <Route path="/">
            <HeaderComponent isNewMonthPage={false} />
            <RouteButtonsComponent tabs={tabs} disabled={editMode} />
          </Route>
        </Switch>
      </div>
    </React.Fragment>
  );
}

export default App;
