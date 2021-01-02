import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Route, Switch } from "react-router-dom";
import schedule from "./assets/devMode/schedule.js";
import { ScheduleDataModel } from "./common-models/schedule-data.model.js";
import { HeaderComponent } from "./components/common-components";
import RouteButtonsComponent from "./components/common-components/route-buttons/route-buttons.component";
import { NewMonthPlanComponent } from "./components/schedule-page/new-month-page.component";
import { SchedulePage } from "./components/schedule-page/schedule-page.component";
import ManagementPage from "./components/workers-page/management-page.component";
import { ScheduleDataActionCreator } from "./state/reducers/schedule-data-reducers/schedule-data.action-creator";

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
      const action = ScheduleDataActionCreator.addNewSchedule(schedule as ScheduleDataModel);
      scheduleDispatcher(action);
    }
  }, [scheduleDispatcher]);

  return (
    <>
      <div>
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
    </>
  );
}

export default App;
