/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import React, { useEffect, useState } from "react";
import { Route, Switch } from "react-router-dom";

import { useDispatch } from "react-redux";
import schedule from "./assets/devMode/schedule";
import { cropScheduleDMToMonthDM, ScheduleDataModel } from "./common-models/schedule-data.model";
import { HeaderComponent } from "./components/common-components";
import RouteButtonsComponent from "./components/common-components/route-buttons/route-buttons.component";
import { SchedulePage } from "./components/schedule-page/schedule-page.component";
import ManagementPage from "./components/workers-page/management-page.component";
import { ScheduleDataActionCreator } from "./state/reducers/month-state/schedule-data/schedule-data.action-creator";
import { NotificationProvider } from "./components/common-components/notification/notification.context";
import { NetlifyProFooter } from "./components/common-components/netlify-pro-footer/netlify-pro-footer.component";
import isElectron from "is-electron";

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
      const monthModel = cropScheduleDMToMonthDM(schedule as ScheduleDataModel);
      const action = ScheduleDataActionCreator.setScheduleFromMonthDM(monthModel);
      scheduleDispatcher(action);
    }
  }, [scheduleDispatcher]);

  return (
    <>
      <div>
        <NotificationProvider>
          <Switch>
            <Route path="/">
              <HeaderComponent isNewMonthPage={false} />
              <RouteButtonsComponent tabs={tabs} disabled={editMode} />
              {isElectron() ? <></> : <NetlifyProFooter />}
            </Route>
          </Switch>
        </NotificationProvider>
      </div>
    </>
  );
}

export default App;
