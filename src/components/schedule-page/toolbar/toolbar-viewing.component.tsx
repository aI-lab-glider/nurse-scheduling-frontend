import React from "react";
import { Button } from "../../common-components";
import { ImportButtonsComponent } from "../import-buttons/import-buttons.component";
import RouteButtonsComponent from "../../common-components/route-buttons/route-buttons.component";
import SchedulePage from "../schedule-page.component";
import ManagementPage from "../../workers-page/management-page.component";
import { Box } from "@material-ui/core";

interface TabData {
  label: string;
  component: JSX.Element;
  right_side_buttons: JSX.Element;
}

interface ToolbarOptions {
  editModeChange: (setEditMode: boolean) => void;
}

export function ToolbarViewingComponent(props: ToolbarOptions): JSX.Element {
  const handleEditMode = props.editModeChange;

  function toggleEdit(open: boolean): void {
    handleEditMode(open);
  }

  function Buttons(): JSX.Element {
    return (
      <>
        <div className={"buttons"}>
          <ImportButtonsComponent />
          <Box>
            <Button
              size="small"
              className="submit-button"
              variant="primary"
              onClick={() => toggleEdit(true)}
            >
              Edytuj
            </Button>
          </Box>
        </div>
      </>
    );
  }

  const tabs: TabData[] = [
    // eslint-disable-next-line @typescript-eslint/camelcase
    { label: "Plan", component: <SchedulePage />, right_side_buttons: Buttons() },
    // eslint-disable-next-line @typescript-eslint/camelcase
    { label: "Zarządzanie", component: <ManagementPage />, right_side_buttons: <div /> },
  ];

  return (
    <>
      <RouteButtonsComponent tabs={tabs} />
    </>
  );
}
