/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */

import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import ArrowForwardIcon from "@material-ui/icons/ArrowForward";
import React, { useContext, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import backend from "../../../api/backend";
import { NetworkErrorCode, ScheduleError } from "../../../common-models/schedule-error.model";
import { ActionModel } from "../../../state/models/action.model";
import { ApplicationStateModel } from "../../../state/models/application-state.model";
import { TEMPORARY_SCHEDULE_UNDOABLE_CONFIG } from "../../../state/reducers/month-state/schedule-data/schedule.actions";
import { ScheduleErrorActionType } from "../../../state/reducers/month-state/schedule-errors.reducer";
import { UndoActionCreator } from "../../../state/reducers/undoable.action-creator";
import { Button } from "../../common-components";
import ConditionalLink from "../../common-components/conditional-link/conditional-link.component";
import { useJiraLikeDrawer } from "../../common-components/drawer/jira-like-drawer-context";
import SaveChangesModal from "../../common-components/modal/save-changes-modal/save-changes-modal.component";
import { useNotification } from "../../common-components/notification/notification.context";
import { ScheduleLogicContext } from "../table/schedule/use-schedule-state";
import ValidationDrawerContentComponent from "../validation-drawer/validation-drawer.component";
import _ from "lodash";
import classNames from "classnames/bind";

interface EditPageToolbarOptions {
  close: () => void;
}

export function EditPageToolbar({ close }: EditPageToolbarOptions): JSX.Element {
  const scheduleLogic = useContext(ScheduleLogicContext);

  const { primaryRevision } = useSelector((app: ApplicationStateModel) => app.actualState);
  const { createNotification } = useNotification();
  const dispatcher = useDispatch();
  const [isSaveModalOpen, setIsSaveModalOpen] = useState(false);
  const { shifts: persistentShifts } = useSelector(
    (state: ApplicationStateModel) => state.actualState.persistentSchedule.present
  );
  const { shifts: temporaryShifts } = useSelector(
    (state: ApplicationStateModel) => state.actualState.temporarySchedule.present
  );
  const [undoCounter, setUndoCounter] = useState(0);

  async function updateScheduleErrors(): Promise<void> {
    const schedule = scheduleLogic?.schedule.getDataModel();
    if (schedule) {
      let response: ScheduleError[];
      try {
        response = await backend.getErrors(schedule, primaryRevision);
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
    setChildrenComponent(
      <ValidationDrawerContentComponent setOpen={setOpen} loadingErrors={true} />
    );
    setTitle("Sprawdź plan");
    setOpen(true);
    updateScheduleErrors().then(() =>
      setChildrenComponent(
        <ValidationDrawerContentComponent setOpen={setOpen} loadingErrors={false} />
      )
    );
  }

  function handleSaveClick(): void {
    scheduleLogic?.updateActualRevision();
    createNotification({ type: "success", message: "Plan został zapisany!" });
  }

  function askForSavingChanges(): void {
    if (anyChanges()) setIsSaveModalOpen(true);
    else close();
  }

  function anyChanges(): boolean {
    if (persistentShifts && temporaryShifts) return !_.isEqual(persistentShifts, temporaryShifts);
    else return false;
  }

  function onUndoClick(): void {
    dispatcher(UndoActionCreator.undo(TEMPORARY_SCHEDULE_UNDOABLE_CONFIG));
    setUndoCounter(undoCounter + 1);
  }

  function onRedoClick(): void {
    dispatcher(UndoActionCreator.redo(TEMPORARY_SCHEDULE_UNDOABLE_CONFIG));
    setUndoCounter(undoCounter - 1);
  }

  return (
    <div className="editing-row">
      <div className="buttons">
        <Button
          onClick={onUndoClick}
          variant="circle"
          data-cy="undo-button"
          disabled={!anyChanges()}
        >
          <ArrowBackIcon
            className={classNames("edit-icons", { "disabled-edit-icon": !anyChanges() })}
          />
        </Button>

        <Button
          onClick={onRedoClick}
          data-cy="redo-button"
          variant="circle"
          disabled={undoCounter === 0}
        >
          <ArrowForwardIcon
            className={classNames("edit-icons", { "disabled-edit-icon": undoCounter === 0 })}
          />
        </Button>

        <div id="edit-panel-text-container">
          <p>Tryb edycji aktywny</p>
        </div>

        <Button
          data-cy="check-schedule-button"
          className="submit-button"
          variant="primary"
          onClick={prepareDrawer}
        >
          Sprawdź Plan
        </Button>

        <div className="filler" />

        <ConditionalLink to="/" shouldNavigate={!anyChanges()}>
          <Button onClick={askForSavingChanges} variant="secondary" data-cy="leave-edit-mode">
            Wyjdź
          </Button>
          <SaveChangesModal
            closeOptions={close}
            handleSave={handleSaveClick}
            open={isSaveModalOpen}
            setOpen={setIsSaveModalOpen}
          />
        </ConditionalLink>

        <Button
          data-cy="save-schedule-button"
          variant="primary"
          disabled={!anyChanges()}
          onClick={(): void => {
            handleSaveClick();
          }}
        >
          Zapisz
        </Button>
      </div>
    </div>
  );
}
