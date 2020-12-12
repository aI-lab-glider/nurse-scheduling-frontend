import React from "react";
import { Link } from "react-router-dom";
import { Button } from "../common-components";
import ValidationDrawerComponent from "./validation-drawer/validation-drawer.component";
import backend from "../../api/backend";
import { ScheduleErrorActionType } from "../../state/reducers/schedule-errors.reducer";
import { ActionModel } from "../../state/models/action.model";
import { ScheduleError } from "../../common-models/schedule-error.model";
import { useDispatch, useSelector } from "react-redux";
import { ApplicationStateModel } from "../../state/models/application-state.model";
import { ScheduleComponent } from "./table/schedule/schedule.component";
import UndoIcon from "@material-ui/icons/Undo";
import RedoIcon from "@material-ui/icons/Redo";
import { ActionCreators as UndoActionCreators } from "redux-undo";

interface ScheduleEditModeOptions {
  closeEdit: () => void;
}

export function ScheduleEditMode(props: ScheduleEditModeOptions): JSX.Element {
  const schedule = useSelector((state: ApplicationStateModel) => state.scheduleData?.present);
  const dispatcher = useDispatch();

  async function updateScheduleErrors(): Promise<void> {
    if (schedule) {
      let response;

      try {
        response = await backend.getErrors(schedule);
      } catch {
        response = [];
      }

      dispatcher({
        type: ScheduleErrorActionType.UPDATE,
        payload: response,
      } as ActionModel<ScheduleError[]>);
    }
  }

  function unDo(): void {
    if (schedule) {
      dispatcher(UndoActionCreators.undo());
    }
  }

  function reDo(): void {
    if (schedule) {
      dispatcher(UndoActionCreators.redo());
    }
  }

  return (
    <div id={"edit-page"}>
      <div className={"editing-row"}>
        <div className={"buttons"}>
          <Button onClick={unDo} variant="circle-outlined">
            <UndoIcon className={"edit-icons"} />
          </Button>

          <Button onClick={reDo} variant="circle-outlined">
            <RedoIcon className={"edit-icons"} />
          </Button>

          <div id={"edit-panel-text-container"}>
            <p>Tryb edycji aktywny</p>
          </div>

          <ValidationDrawerComponent />

          <Button
            size="small"
            className="submit-button"
            variant="primary"
            onClick={updateScheduleErrors}
          >
            Sprawdź Plan
          </Button>

          <div className={"filler"} />

          <Button size="small" className="submit-button" variant="outlined">
            Zapisz
          </Button>

          <Link to={"/"}>
            <Button
              onClick={(): void => props.closeEdit()}
              size="small"
              className="submit-button"
              variant="primary"
            >
              Wyjdź
            </Button>
          </Link>
        </div>
      </div>
      <div className={"schedule"}>
        <ScheduleComponent />
      </div>
    </div>
  );
}
