import React, { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { ActionCreators as UndoActionCreators } from "redux-undo";
import backend from "../../../api/backend";
import { ScheduleError } from "../../../common-models/schedule-error.model";
import { ActionModel } from "../../../state/models/action.model";
import { ScheduleErrorActionType } from "../../../state/reducers/schedule-errors.reducer";
import { Button } from "../../common-components";
import ValidationDrawerComponent from "../validation-drawer/validation-drawer.component";
import UndoIcon from "@material-ui/icons/Undo";
import RedoIcon from "@material-ui/icons/Redo";
import { ScheduleLogicContext } from "../table/schedule/use-schedule-state";

interface EditPageToolbarOptions {
  closeEdit: () => void;
}

export function EditPageToolbar({ closeEdit }: EditPageToolbarOptions): JSX.Element {
  const scheduleLogic = useContext(ScheduleLogicContext);
  const dispatcher = useDispatch();
  const [openDrawer, setOpenDrawer] = useState(false);
  async function updateScheduleErrors(): Promise<void> {
    const schedule = scheduleLogic?.schedule.getDataModel();
    if (schedule) {
      let response: ScheduleError[];
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

  function prepareDrawer(): void {
    updateScheduleErrors();
    setOpenDrawer(true);
  }

  return (
    <div className="editing-row">
      <div className="buttons">
        <Button
          onClick={(): void => {
            dispatcher(UndoActionCreators.undo());
          }}
          variant="circle-outlined"
          data-cy="undo-button"
        >
          <UndoIcon className="edit-icons" />
        </Button>

        <Button
          onClick={(): void => {
            dispatcher(UndoActionCreators.redo());
          }}
          data-cy="redo-button"
          variant="circle-outlined"
        >
          <RedoIcon className="edit-icons" />
        </Button>

        <div id="edit-panel-text-container">
          <p>Tryb edycji aktywny</p>
        </div>

        <ValidationDrawerComponent open={openDrawer} setOpen={setOpenDrawer} />

        <Button
          size="small"
          data-cy="check-schedule-button"
          className="submit-button"
          variant="primary"
          onClick={prepareDrawer}
        >
          Sprawdź Plan
        </Button>

        <div className="filler" />

        <Button
          size="small"
          className="submit-button"
          data-cy="save-schedule-button"
          variant="outlined"
          onClick={(): void => {
            scheduleLogic?.updateActualRevision();
          }}
        >
          Zapisz
        </Button>

        <Link to="/">
          <Button onClick={closeEdit} size="small" className="submit-button" variant="primary">
            Wyjdź
          </Button>
        </Link>
      </div>
    </div>
  );
}
