import React from "react";
import { Link } from "react-router-dom";
import { Button } from "../common-components";
import { Box } from "@material-ui/core";
import ValidationDrawerComponent from "./validation-drawer/validation-drawer.component";
import backend from "../../api/backend";
import { ScheduleErrorActionType } from "../../state/reducers/schedule-errors.reducer";
import { ActionModel } from "../../state/models/action.model";
import { ScheduleError } from "../../common-models/schedule-error.model";
import { useDispatch, useSelector } from "react-redux";
import { ApplicationStateModel } from "../../state/models/application-state.model";
import { ScheduleComponent } from "./table/schedule/schedule.component";

export function ScheduleEditingComponent(): JSX.Element {
  const schedule = useSelector((state: ApplicationStateModel) => state.scheduleData?.present);
  const dispatcher = useDispatch();

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
              <Link to={"/"}>
                <Button size="small" className="submit-button" variant="primary">
                  Pogląd
                </Button>
              </Link>
            </Box>
          </div>
        </div>
        <div id={"schedule-editing"}>
          <ScheduleComponent />
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
