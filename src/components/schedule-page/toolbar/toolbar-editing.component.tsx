import React from "react";
import { Button } from "../../common-components";
import { Box } from "@material-ui/core";
import ValidationDrawerComponent from "../validation-drawer/validation-drawer.component";
import backend from "../../../api/backend";
import { ScheduleErrorActionType } from "../../../state/reducers/schedule-errors.reducer";
import { ActionModel } from "../../../state/models/action.model";
import { ScheduleError } from "../../../common-models/schedule-error.model";
import { useDispatch, useSelector } from "react-redux";
import { ApplicationStateModel } from "../../../state/models/application-state.model";
import SchedulePage from "../schedule-page.component";

interface ToolbarOptions {
  editModeChange: (setEditMode: boolean) => void;
}

export function ToolbarEditingComponent(props: ToolbarOptions): JSX.Element {
  const handleEditMode = props.editModeChange;
  const schedule = useSelector((state: ApplicationStateModel) => state.scheduleData?.present);
  const dispatcher = useDispatch();

  function toggleEdit(open: boolean): void {
    handleEditMode(open);
  }

  async function updateScheduleErrors(): Promise<void> {
    if (schedule) {
      const response = await backend.getErrors(schedule);
      dispatcher({
        type: ScheduleErrorActionType.UPDATE,
        payload: response,
      } as ActionModel<ScheduleError[]>);
    }
  }

  function Buttons(): JSX.Element {
    return (
      <div id={"edit-page"}>
        <div className={"editing-row"}>
          <div className={"buttons"}>
            <div className={"filler"} />

            <Button size="small" className="submit-button" variant="outlined">
              ReDo
            </Button>

            <Button size="small" className="submit-button" variant="outlined">
              UnDo
            </Button>

            <Button size="small" className="submit-button" variant="outlined">
              Zapisz
            </Button>

            <ValidationDrawerComponent />

            <Button
              size="small"
              className="submit-button"
              variant="outlined"
              onClick={updateScheduleErrors}
            >
              Sprawdź Plan
            </Button>
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
        </div>
        <div id={"schedule-editing"}>
          <SchedulePage />
        </div>
      </div>
    );
  }

  return (
    <div className="toolbar-container">
      <Buttons />
    </div>
  );
}
