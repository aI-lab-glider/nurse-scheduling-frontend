import React from "react";
import { Link } from "react-router-dom";
import { Button } from "../../common-components";
import { ImportButtonsComponent } from "../import-buttons/import-buttons.component";
import RouteButtonsComponent from "../../common-components/route-buttons/route-buttons.component";
import SchedulePage from "../schedule-page.component";
import ManagementPage from "../../workers-page/management-page.component";
import { Box } from "@material-ui/core";

interface TabData {
  label: string;
  component: JSX.Element;
  rightSideButtons: JSX.Element;
}

export function ToolbarViewingComponent(): JSX.Element {
  function Buttons(): JSX.Element {
    return (
      <>
        <div className={"buttons"}>
          <ImportButtonsComponent />
          <Box>
            <Link to={"/schedule-editing"}>
              <Button size="small" className="submit-button" variant="primary">
                Edytuj
              </Button>
            </Link>
          </Box>
        </div>
      </>
    );
  }

  const tabs: TabData[] = [
    { label: "Plan", component: <SchedulePage />, rightSideButtons: <Buttons /> },
    { label: "Zarządzanie", component: <ManagementPage />, rightSideButtons: <div /> },
  ];

  return (
    <div className="toolbar-container">
      <RouteButtonsComponent tabs={tabs} />
    </div>
  );
}
