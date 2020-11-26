import React from "react";
import { Tab } from "@material-ui/core";
import TabContext from "@material-ui/lab/TabContext";
import TabList from "@material-ui/lab/TabList";
import TabPanel from "@material-ui/lab/TabPanel";
import ShiftTab from "./shifts-tab/shifts-tab.component";
import ConstraintTab from "./constraints-tab/constraints-tab.component";
import WorkersTab from "./workers-tab/workers-tab.component";
import { ImportButtonsComponent } from "../schedule-page/import-buttons/import-buttons.component";

export default function WorkersPage(): JSX.Element {
  const [value, setValue] = React.useState("1");

  const handleChange = (event: React.ChangeEvent<{}>, newValue: string): void => {
    setValue(newValue);
  };

  return (
    <div>
      {/* TODO: Remove after development*/}
      <ImportButtonsComponent />
      <h2>Panel zarządzania</h2>
      <h4>Październik</h4>
      <TabContext value={value}>
        <TabList onChange={handleChange}>
          <Tab label="Pracownicy" value="1" />
          <Tab label="Zmiany" value="2" />
          <Tab label="Ograniczenia" value="3" />
        </TabList>
        <TabPanel value="1">
          <WorkersTab />
        </TabPanel>
        <TabPanel value="2">
          <ShiftTab />
        </TabPanel>
        <TabPanel value="3">
          <ConstraintTab />
        </TabPanel>
      </TabContext>
    </div>
  );
}
