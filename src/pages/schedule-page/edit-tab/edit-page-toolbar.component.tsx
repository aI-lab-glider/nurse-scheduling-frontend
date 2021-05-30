/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */

import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import ArrowForwardIcon from "@material-ui/icons/ArrowForward";
import * as _ from "lodash";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import styled, { css } from "styled-components";
import backend from "../../../api/backend";
import { colors, fontSizeBase, fontSizeXl } from "../../../assets/colors";
import { Button } from "../../../components/common-components";
import ConditionalLink from "../../../components/common-components/conditional-link/conditional-link.component";
import { usePersistentDrawer } from "../../../components/drawers/drawer/persistent-drawer-context";
import ErrorContainerDrawerComponent from "../../../components/drawers/error-container-drawer/error-container-drawer.component";
import SaveChangesModal from "../../../components/modals/save-changes-modal/save-changes-modal.component";
import { useNotification } from "../../../components/notification/notification.context";
import { t } from "../../../helpers/translations.helper";
import { useTemporarySchedule } from "../../../hooks/use-temporary-schedule";
import {
  NetworkErrorCode,
  ScheduleError,
} from "../../../state/schedule-data/schedule-errors/schedule-error.model";
import { updateScheduleErrors } from "../../../state/schedule-data/schedule-errors/schedule-errors.reducer";
import { TEMPORARY_SCHEDULE_UNDOABLE_CONFIG } from "../../../state/schedule-data/schedule.actions";
import {
  getPresentScheduleShifts,
  getPresentTemporarySchedule,
  getPresentTemporaryScheduleShifts,
  getPrimaryRevision,
} from "../../../state/schedule-data/selectors";
import { UndoActionCreator } from "../../../state/schedule-data/undoable.action-creator";
import { WorkerShiftsModel } from "../../../state/schedule-data/workers-shifts/worker-shifts.model";

interface EditPageToolbarOptions {
  close: () => void;
}

export function EditPageToolbar({ close }: EditPageToolbarOptions): JSX.Element {
  const schedule = useSelector(getPresentTemporarySchedule);

  const primaryRevision = useSelector(getPrimaryRevision);
  const { createNotification } = useNotification();
  const dispatcher = useDispatch();
  const [isSaveModalOpen, setIsSaveModalOpen] = useState(false);
  const persistentShifts: WorkerShiftsModel = useSelector(getPresentScheduleShifts);
  const temporaryShifts: WorkerShiftsModel = useSelector(getPresentTemporaryScheduleShifts);
  const [undoCounter, setUndoCounter] = useState(0);

  async function updateScheduleError(): Promise<void> {
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
      dispatcher(updateScheduleErrors(response));
    }
  }

  const { setTitle, setOpen, setChildrenComponent } = usePersistentDrawer();

  function prepareDrawer(): void {
    setChildrenComponent(<ErrorContainerDrawerComponent setOpen={setOpen} loadingErrors />);
    setTitle("Sprawdź plan");
    setOpen(true);
    updateScheduleError().then(() =>
      setChildrenComponent(
        <ErrorContainerDrawerComponent setOpen={setOpen} loadingErrors={false} />
      )
    );
  }

  const { saveToPersistent } = useTemporarySchedule();

  function handleSaveClick(): void {
    saveToPersistent();
    createNotification({ type: "success", message: "Plan został zapisany!" });
  }

  function askForSavingChanges(): void {
    if (anyChanges()) setIsSaveModalOpen(true);
    else close();
  }

  function anyChanges(): boolean {
    if (persistentShifts && temporaryShifts) return !_.isEqual(persistentShifts, temporaryShifts);
    return false;
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
    <Wrapper>
      <Button onClick={onUndoClick} variant="circle" data-cy="undo-button" disabled={!anyChanges()}>
        <UndoIcon />
      </Button>

      <Button
        onClick={onRedoClick}
        data-cy="redo-button"
        variant="circle"
        disabled={undoCounter === 0}
      >
        <RedoIcon />
      </Button>

      <EditTextWrapper data-cy="edit-mode-text">Tryb edycji aktywny</EditTextWrapper>

      <Button data-cy="check-schedule-button" variant="primary" onClick={prepareDrawer}>
        {t("editPageToolbar_checkPlan")}
      </Button>

      <Filler />

      <ConditionalLink to="/" shouldNavigate={!anyChanges()}>
        <Button onClick={askForSavingChanges} variant="secondary" data-cy="leave-edit-mode">
          {t("editPageToolbar_exit")}
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
        {t("editPageToolbar_savePlan")}
      </Button>
    </Wrapper>
  );
}

const Wrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  width: 100%;
  margin: 5px;
`;

const undoRedoIcon = css`
  color: ${colors.primary};
  font-size: ${fontSizeXl};
  margin: auto 10px auto 10px;
`;

const UndoIcon = styled(ArrowBackIcon)`
  ${undoRedoIcon}
`;
const RedoIcon = styled(ArrowForwardIcon)`
  ${undoRedoIcon}
`;
const Filler = styled.div`
  flex-grow: 1;
`;
const EditTextWrapper = styled.p`
  color: ${colors.primary};
  font-size: ${fontSizeBase};
  margin: auto;
`;
