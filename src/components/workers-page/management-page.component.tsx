import React from "react";
import { Tab } from "@material-ui/core";
import TabContext from "@material-ui/lab/TabContext";
import TabList from "@material-ui/lab/TabList";
import TabPanel from "@material-ui/lab/TabPanel";

export default function WorkersPage(): JSX.Element {
  const [value, setValue] = React.useState("1");

  const handleChange = (event: React.ChangeEvent<{}>, newValue: string): void => {
    setValue(newValue);
  };

  return (
    <div>
      <h2>Panel zarządzania</h2>
      <h4>Październik</h4>
      <TabContext value={value}>
        <TabList onChange={handleChange} aria-label="simple tabs example">
          <Tab label="Item One" value="1" />
          <Tab label="Item Two" value="2" />
          <Tab label="Item Three" value="3" />
        </TabList>
        <TabPanel value="1">Item One</TabPanel>
        <TabPanel value="2">Item Two</TabPanel>
        <TabPanel value="3">Item Three</TabPanel>
      </TabContext>{" "}
    </div>
  );
}
