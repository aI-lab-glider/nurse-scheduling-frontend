import React from "react";
import { Divider, Tab } from "@material-ui/core";
import TabContext from "@material-ui/lab/TabContext";
import TabList from "@material-ui/lab/TabList";
import TabPanel from "@material-ui/lab/TabPanel";
import ShiftTab from "./shifts-tab/shifts-tab.component";
import ConstraintTab from "./constraints-tab/constraints-tab.component";
import WorkersTab from "./workers-tab/workers-tab.component";
import { ImportButtonsComponent } from "../schedule-page/import-buttons/import-buttons.component";

interface TabData {
  label: string;
  component: JSX.Element;
}

export default function ManagementPage(): JSX.Element {
  const tabs: TabData[] = [
    { label: "Pracownicy", component: <WorkersTab /> },
    { label: "Zmiany", component: <ShiftTab /> },
    { label: "Ograniczenia", component: <ConstraintTab /> },
  ];

  const [tab, setTab] = React.useState(tabs[0].label);

  const handleChange = (event: React.ChangeEvent<{}>, newTab: string): void => {
    setTab(newTab);
  };

  return (
    <div className="management-page">
      {/* TODO: Remove ImportButtonsComponent after development*/}
      <ImportButtonsComponent />
      <h1>Panel zarządzania</h1>
      <Divider />
      <TabContext value={tab}>
        <TabList onChange={handleChange} textColor={"primary"} indicatorColor={"primary"}>
          {tabs.map((tab) => (
            <Tab label={tab.label} value={tab.label} />
          ))}
        </TabList>
        <Divider />
        {tabs.map((tab) => (
          <TabPanel value={tab.label}>{tab.component}</TabPanel>
        ))}
      </TabContext>
    </div>
  );
}
