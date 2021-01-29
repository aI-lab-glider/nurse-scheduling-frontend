/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */

import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import backend from "../../../api/backend";
import { NetworkErrorCode, ScheduleError } from "../../../common-models/schedule-error.model";
import { ActionModel } from "../../../state/models/action.model";
import { ScheduleErrorActionType } from "../../../state/reducers/month-state/schedule-errors.reducer";
import { Button } from "../../common-components";
import UndoIcon from "@material-ui/icons/Undo";
import RedoIcon from "@material-ui/icons/Redo";
import { ScheduleLogicContext } from "../table/schedule/use-schedule-state";
import { UndoActionCreator } from "../../../state/reducers/undoable.action-creator";
import { TEMPORARY_SCHEDULE_UNDOABLE_CONFIG } from "../../../state/reducers/month-state/schedule-data/schedule.actions";
import { useNotification } from "../../common-components/notification/notification.context";
import { useJiraLikeDrawer } from "../../common-components/drawer/jira-like-drawer-context";
import ValidationDrawerContentComponent from "../validation-drawer/validation-drawer.component";

interface EditPageToolbarOptions {
  closeEdit: () => void;
}

export function EditPageToolbar({ closeEdit }: EditPageToolbarOptions): JSX.Element {
  const scheduleLogic = useContext(ScheduleLogicContext);
  const { createNotification } = useNotification();
  const dispatcher = useDispatch();

  async function updateScheduleErrors(): Promise<void> {
    const schedule = scheduleLogic?.schedule.getDataModel();
    if (schedule) {
      let response: ScheduleError[];
      try {
        response = await backend.getErrors(schedule);
      } catch (err) {
        response = [
          {
            kind: NetworkErrorCode.NETWORK_ERROR,
          },
        ];
      }
      dispatcher({
        type: ScheduleErrorActionType.UPDATE,
        payload: response,
      } as ActionModel<ScheduleError[]>);
    }
  }

  const { setTitle, setOpen, setChildrenComponent } = useJiraLikeDrawer();

  function prepareDrawer(): void {
    updateScheduleErrors();
    setTitle("Sprawdź plan");
    setChildrenComponent(<ValidationDrawerContentComponent setOpen={setOpen} />);
    setOpen(true);
  }

  function handleSaveClick(): void {
    scheduleLogic?.updateActualRevision();
    createNotification({ type: "success", message: "Plan został zapisany!" });
  }

  return (
    <div className="editing-row">
      <div className="buttons">
        <Button
          onClick={(): void => {
            dispatcher(UndoActionCreator.undo(TEMPORARY_SCHEDULE_UNDOABLE_CONFIG));
          }}
          variant="circle-outlined"
          data-cy="undo-button"
        >
          <UndoIcon className="edit-icons" />
        </Button>

        <Button
          onClick={(): void => {
            dispatcher(UndoActionCreator.redo(TEMPORARY_SCHEDULE_UNDOABLE_CONFIG));
          }}
          data-cy="redo-button"
          variant="circle-outlined"
        >
          <RedoIcon className="edit-icons" />
        </Button>

        <div id="edit-panel-text-container">
          <p>Tryb edycji aktywny</p>
        </div>

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
            handleSaveClick();
          }}
        >
          Zapisz
        </Button>

        <Link to="/">
          <Button
            onClick={closeEdit}
            size="small"
            className="submit-button"
            variant="primary"
            data-cy="leave-edit-mode"
          >
            Wyjdź
          </Button>
        </Link>
      </div>
    </div>
  );
}
