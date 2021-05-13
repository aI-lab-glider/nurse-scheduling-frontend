/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Route, Switch } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Box } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
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
import PersistentDrawer from "./components/drawers/drawer/persistent-drawer.component";
import { PersistentDrawerProvider } from "./components/drawers/drawer/persistent-drawer-context";
import ScssVars from "./assets/styles/styles/custom/_variables.module.scss";
import { ApplicationStateModel } from "./state/application-state.model";
import { AppMode, useAppConfig } from "./state/app-config-context";
import { cropScheduleDMToMonthDM } from "./logic/schedule-container-converter/schedule-container-converter";
import { ImportModalProvider } from "./components/buttons/import-buttons/import-modal-context";
import NewVersionModal from "./components/modals/new-version-modal/new-version.modal.component";
import { CookiesProvider } from "./logic/data-access/cookies-provider";
import { ScheduleKey } from "./logic/data-access/persistance-store.model";
import { latestAppVersion } from "./api/latest-github-version";
import { t } from "./helpers/translations.helper";
import { createGlobalStyle } from "styled-components";

const GlobalStyle = createGlobalStyle`
*,
*::before,
*::after {
  box-sizing: border-box; // 1
}

html {
  font-family: sans-serif; // 2
  line-height: 1.15; // 3
  -webkit-text-size-adjust: 100%; // 4
  -ms-text-size-adjust: 100%; // 4
  -ms-overflow-style: scrollbar; // 5
  -webkit-tap-highlight-color: rgba($black, 0); // 6
}

@at-root {
  @-ms-viewport {
    width: device-width;
  }
}

article,
aside,
figcaption,
figure,
footer,
header,
hgroup,
main,
nav,
section {
  display: block;
}

body {
  margin: 0; // 1
  font-family: $font-family-base;
  font-size: $font-size-base;
  font-weight: $font-weight-base;
  line-height: $line-height-base;
  color: $body-color;
  text-align: left; // 3
  background-color: $body-bg; // 2
}

[tabindex="-1"]:focus {
  outline: 0 !important;
}

hr {
  box-sizing: content-box;
  height: 0;
  overflow: visible;
}

h1,
h2,
h3,
h4,
h5,
h6 {
  margin-top: 0;
  margin-bottom: $headings-margin-bottom;
}

p {
  margin-top: 0;
  margin-bottom: $paragraph-margin-bottom;
}

abbr[title],
abbr[data-original-title] {
  text-decoration: underline;
  text-decoration: underline dotted;
  cursor: help;
  border-bottom: 0;
}

address {
  margin-bottom: 1rem;
  font-style: normal;
  line-height: inherit;
}

ol,
ul,
dl {
  margin-top: 0;
  margin-bottom: 1rem;
}

ol ol,
ul ul,
ol ul,
ul ol {
  margin-bottom: 0;
}

dt {
  font-weight: $dt-font-weight;
}

dd {
  margin-bottom: 0.5rem;
  margin-left: 0;
}

blockquote {
  margin: 0 0 1rem;
}

dfn {
  font-style: italic;
}

b,
strong {
  font-weight: bolder;
}

small {
  font-size: 80%;
}

sub,
sup {
  position: relative;
  font-size: 75%;
  line-height: 0;
  vertical-align: baseline;
}

sub {
  bottom: -0.25em;
}
sup {
  top: -0.5em;
}

a {
  color: $link-color;
  text-decoration: $link-decoration;
  background-color: transparent;
  -webkit-text-decoration-skip: objects;

  @include hover {
    color: $link-hover-color;
    text-decoration: $link-hover-decoration;
  }
}

a:not([href]):not([tabindex]) {
  color: inherit;
  text-decoration: none;

  @include hover-focus {
    color: inherit;
    text-decoration: none;
  }

  &:focus {
    outline: 0;
  }
}

pre,
code,
kbd,
samp {
  font-family: $font-family-monospace;
  font-size: 1em;
}

pre {
  margin-top: 0;
  margin-bottom: 1rem;
  overflow: auto;
  -ms-overflow-style: scrollbar;
}

figure {
  margin: 0 0 1rem;
}

img {
  vertical-align: middle;
  border-style: none;
}

svg {
  overflow: hidden;
  vertical-align: middle;
}

table {
  border-collapse: collapse;
}

caption {
  padding-top: $table-cell-padding;
  padding-bottom: $table-cell-padding;
  color: $table-caption-color;
  text-align: left;
  caption-side: bottom;
}

th {
  text-align: inherit;
}

label {
  display: inline-block;
  margin-bottom: $label-margin-bottom;
}

button {
  border-radius: 0;
}

button:focus {
  outline: 1px dotted;
  outline: 5px auto -webkit-focus-ring-color;
}

input,
button,
select,
optgroup,
textarea {
  margin: 0;
  font-family: inherit;
  font-size: inherit;
  line-height: inherit;
}

button,
input {
  overflow: visible;
}

button,
select {
  text-transform: none;
}

button,
html [type="button"],
[type="reset"],
[type="submit"] {
  -webkit-appearance: button;
}

button::-moz-focus-inner,
[type="button"]::-moz-focus-inner,
[type="reset"]::-moz-focus-inner,
[type="submit"]::-moz-focus-inner {
  padding: 0;
  border-style: none;
}

input[type="radio"],
input[type="checkbox"] {
  box-sizing: border-box;
  padding: 0;
}

input[type="date"],
input[type="time"],
input[type="datetime-local"],
input[type="month"] {
  -webkit-appearance: listbox;
}

textarea {
  overflow: auto;
  resize: vertical;
}

fieldset {
  padding: 0;
  margin: 0;
  border: 0;
}

legend {
  display: block;
  width: 100%;
  max-width: 100%;
  padding: 0;
  margin-bottom: 0.5rem;
  font-size: 1.5rem;
  line-height: inherit;
  color: inherit;
  white-space: normal;
}

progress {
  vertical-align: baseline;
}

[type="number"]::-webkit-inner-spin-button,
[type="number"]::-webkit-outer-spin-button {
  height: auto;
}

[type="search"] {
  outline-offset: -2px;
  -webkit-appearance: none;
}

[type="search"]::-webkit-search-cancel-button,
[type="search"]::-webkit-search-decoration {
  -webkit-appearance: none;
}

::-webkit-file-upload-button {
  font: inherit;
  -webkit-appearance: button;
}

output {
  display: inline-block;
}

summary {
  display: list-item;
  cursor: pointer;
}

template {
  display: none;
}

[hidden] {
  display: none !important;
}

`;

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

function App(): JSX.Element {
  const classes = useStyles();
  const scheduleDispatcher = useDispatch();
  const [disableRouteButtons, setDisableRouteButtons] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
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
        component: (
          <SchedulePage
            editModeHandler={(val) => {
              setDisableRouteButtons(val);
            }}
          />
        ),
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
    [setDisableRouteButtons, setMode]
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
    const checkVersions = async (): Promise<void> => {
      const localVersion = CookiesProvider.getAppVersion();
      const githubVersion = await latestAppVersion;
      if (localVersion !== githubVersion) {
        CookiesProvider.setAppVersion(githubVersion);
        localVersion && setIsModalOpen(true);
      }
    };
    checkVersions();
  }, []);

  return (
    <>
      <GlobalStyle />
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
                  <NewVersionModal open={isModalOpen} setOpen={setIsModalOpen} />
                </Box>
              </Route>
            </Switch>
          </ImportModalProvider>
        </PersistentDrawerProvider>
      </NotificationProvider>
    </>
  );
}

export default App;
