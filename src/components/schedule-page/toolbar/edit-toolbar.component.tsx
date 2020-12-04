import React from "react";
import { Link } from "react-router-dom";
import { Button } from "../../common-components";
import ValidationDrawerComponent from "../validation-drawer/validation-drawer.component";
import backend from "../../../api/backend";
import { ScheduleErrorActionType } from "../../../state/reducers/schedule-errors.reducer";
import { ActionModel } from "../../../state/models/action.model";
import { ScheduleError } from "../../../common-models/schedule-error.model";
import { useDispatch, useSelector } from "react-redux";
import { ApplicationStateModel } from "../../../state/models/application-state.model";
import { ScheduleComponent } from "../table/schedule/schedule.component";
import UndoIcon from "@material-ui/icons/Undo";
import RedoIcon from "@material-ui/icons/Redo";

export function EditToolbarComponent(): JSX.Element {
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

  return (
    <div id={"edit-page"}>
      <div className={"editing-row"}>
        <div className={"buttons"}>
          <div className={"filler"} />

          <div id={"edit-panel-text-container"}>
            <p>Tryb edycji aktywny</p>
          </div>

          <Button variant="circle-outlined">
            <UndoIcon className={"edit-icons"} />
          </Button>

          <Button variant="circle-outlined">
            <RedoIcon className={"edit-icons"} />
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
          <Link to={"/"}>
            <Button size="small" className="submit-button" variant="primary">
              Pogląd
            </Button>
          </Link>
        </div>
      </div>
      <div id={"schedule-editing"}>
        <ScheduleComponent />
      </div>
    </div>
  );
}
