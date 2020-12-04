import React, { useEffect } from "react";
import SchedulePage from "./components/schedule-page/schedule-page.component";
import ManagementPage from "./components/workers-page/management-page.component";
import RouteButtonsComponent from "./components/common-components/route-buttons/route-buttons.component";
import { CustomGlobalHotKeys, HeaderComponent } from "./components/common-components";
import { ScheduleDataActionType } from "./state/reducers/schedule-data.reducer";
import { ActionModel } from "./state/models/action.model";
import { ScheduleDataModel } from "./common-models/schedule-data.model";
import { useDispatch } from "react-redux";
import schedule from "./assets/devMode/schedule.js";

interface TabData {
  label: string;
  component: JSX.Element;
}

const tabs: TabData[] = [
  { label: "Plan", component: <SchedulePage /> },
  { label: "Zarządzanie", component: <ManagementPage /> },
];

function App(): JSX.Element {
  const scheduleDispatcher = useDispatch();
  useEffect(() => {
    if (process.env.REACT_APP_DEV_MODE === "true") {
      scheduleDispatcher({
        type: ScheduleDataActionType.ADD_NEW,
        payload: schedule,
      } as ActionModel<ScheduleDataModel>);
    }
  }, []);

  return (
    <React.Fragment>
      <CustomGlobalHotKeys />
      <HeaderComponent />
      <RouteButtonsComponent tabs={tabs} />
    </React.Fragment>
  );
}

export default App;
