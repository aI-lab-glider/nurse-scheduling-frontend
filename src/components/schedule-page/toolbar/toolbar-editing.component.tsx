import React from "react";
import { Button, MonthSwitchComponent } from "../../common-components";
import { ImportButtonsComponent } from "../import-buttons/import-buttons.component";
import { Box } from "@material-ui/core";

export function ToolbarEditingComponent(props): JSX.Element {
  const handleEditMode = props.editModeChange;

  function toggleEdit(open: boolean): void {
    handleEditMode(open);
  }

  function Buttons(): JSX.Element {
    return (
      <>
        <div className={"buttons"}>
          <Box>
            <Button
              size="small"
              className="submit-button"
              variant="primary"
              onClick={(): void => toggleEdit(false)}
            >
              Pogląd
            </Button>
          </Box>
        </div>
      </>
    );
  }

  return (
    <div className="toolbar-container">
      <Buttons />
    </div>
  );
}
