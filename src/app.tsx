/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import React, { useCallback, useEffect, useMemo, useState } from "react";
import i18n from "i18next";
import { initReactI18next, useTranslation } from "react-i18next";
import { Route, Switch } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import schedule from "./assets/devMode/schedule";
import { ScheduleDataModel } from "./state/schedule-data/schedule-data.model";
import { HeaderComponent } from "./components/common-components";
import RouteButtonsComponent, {
  Tabs,
} from "./components/buttons/route-buttons/route-buttons.component";
import { SchedulePage } from "./pages/schedule-page/schedule-page.component";
import ManagementPage from "./pages/management-page/management-page.component";
import { ScheduleDataActionCreator } from "./state/schedule-data/schedule-data.action-creator";
import { NotificationProvider } from "./components/notification/notification.context";
import { Footer } from "./components/footer/footer.component";
import { Box } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import PersistentDrawer from "./components/drawers/drawer/persistent-drawer.component";
import { PersistentDrawerProvider } from "./components/drawers/drawer/persistent-drawer-context";
import ScssVars from "./assets/styles/styles/custom/_variables.module.scss";
import { ApplicationStateModel } from "./state/application-state.model";
import { AppMode, useAppConfig } from "./state/app-config-context";
import { cropScheduleDMToMonthDM } from "./logic/schedule-container-converter/schedule-container-converter";
import { ImportModalProvider } from "./components/buttons/import-buttons/import-modal-context";
import { LocalStorageProvider } from "./logic/data-access/local-storage-provider.model";
import { ScheduleKey } from "./logic/data-access/persistance-store.model";
//Localization resources
import resources from "./assets/translations";

const useStyles = makeStyles(() => ({
  root: {
    display: "flex",
  },
  content: {
    display: "block",
    overflowX: "auto",
    overflowY: "auto",
    height: "100vh",
    flexGrow: 1,
  },
  drawer: {
    marginTop: ScssVars.headerHeight,
    background: ScssVars.white,
    borderLeft: "1px solid #EFF0F6",
    boxShadow: "0px 0px 5px 0px #00000015",
    position: "relative",
    zIndex: 80,
  },
}));

//Localization initialization
i18n.use(initReactI18next).init({
  fallbackLng: "pl",
  resources,
});
function App(): JSX.Element {
  const { t } = useTranslation();
  const classes = useStyles();
  const scheduleDispatcher = useDispatch();
  const [disableRouteButtons, setDisableRouteButtons] = useState<boolean>(false);
  const { setMode } = useAppConfig();
  const { month_number: month, year } = useSelector(
    (state: ApplicationStateModel) => state.actualState.persistentSchedule.present.schedule_info
  );
  const { isAutoGenerated } = useSelector(
    (state: ApplicationStateModel) => state.actualState.persistentSchedule.present
  );
  const { isCorrupted } = useSelector(
    (state: ApplicationStateModel) => state.actualState.persistentSchedule.present
  );
  const tabs: Tabs[] = useMemo(
    () => [
      {
        label: t("schedule"),
        component: <SchedulePage editModeHandler={setDisableRouteButtons} />,
        onChange: (): void => setMode(AppMode.SCHEDULE),
        dataCy: "btn-schedule-tab",
      },
      {
        label: t("management"),
        component: <ManagementPage />,
        onChange: (): void => setMode(AppMode.MANAGEMENT),
        dataCy: "btn-management-tab",
      },
    ],
    [setDisableRouteButtons, setMode, t]
  );
  useEffect(() => {
    setDisableRouteButtons(isAutoGenerated || isCorrupted);
  }, [isAutoGenerated, isCorrupted]);

  const fetchGlobalState = useCallback(() => {
    if (process.env.REACT_APP_DEV_MODE === "true") {
      const monthModel = cropScheduleDMToMonthDM(schedule as ScheduleDataModel);
      const action = ScheduleDataActionCreator.setScheduleFromMonthDMAndSaveInDB(monthModel);
      scheduleDispatcher(action);
    } else {
      const action = ScheduleDataActionCreator.setScheduleIfExistsInDb(
        new ScheduleKey(month, year),
        "actual"
      );

      scheduleDispatcher(action);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    fetchGlobalState();
  }, [fetchGlobalState]);

  useEffect(() => {
    new LocalStorageProvider().saveApplicationVersion().then();
  }, []);

  return (
    <NotificationProvider>
      <PersistentDrawerProvider>
        <ImportModalProvider>
          <Switch>
            <Route path="/">
              <Box className={classes.root}>
                <Box className={classes.content}>
                  <HeaderComponent />
                  <RouteButtonsComponent tabs={tabs} disabled={disableRouteButtons} />
                  <Footer />
                </Box>
                <Box className={classes.drawer}>
                  <PersistentDrawer width={690} />
                </Box>
              </Box>
            </Route>
          </Switch>
        </ImportModalProvider>
      </PersistentDrawerProvider>
    </NotificationProvider>
  );
}

export default App;
