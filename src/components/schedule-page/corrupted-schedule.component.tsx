/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import React, { useCallback } from "react";
import { EmptyMonthButtons } from "./empty-month-buttons";
import sadEmoji from "../../assets/images/sadEmoji.svg";
import { useDispatch, useSelector } from "react-redux";
import { ApplicationStateModel } from "../../state/models/application-state.model";
import { UndoActionCreator } from "../../state/reducers/undoable.action-creator";
import { PERSISTENT_SCHEDULE_UNDOABLE_CONFIG } from "../../state/reducers/month-state/schedule-data/schedule.actions";
import { Button } from "../common-components";
import { ScheduleDataModel } from "../../common-models/schedule-data.model";

const MINIMUM_UNDO_COUNT_TO_REVERT_NORMAL_SCHEDULE = 2; // schedule which caused corruption and the same schedule with isCorrupted=true
const MSG_UNABLE_TO_LOAD_SCHEDULE = "Nie można wyświetlić zapisanego grafiku";
const MSG_RESTORE_PREV = "Przywróć poprzednią wersję grafiku";
const MSG_LOAD_AGAIN = "Wczytaj ponownie grafik";
const MSG_LOAD_AGAIN_TOO = "Możesz też wczytać grafik ponownie";

export function CorruptedScheduleComponent(): JSX.Element {
  const dispatch = useDispatch();
  const { past } = useSelector(
    (state: ApplicationStateModel) => state.actualState.persistentSchedule
  );
  const { month_number: month, year } = useSelector(
    (state: ApplicationStateModel) => state.actualState.persistentSchedule.present.schedule_info
  );

  const isCurrentNotCorruptedSchedule = useCallback(
    (schedule: ScheduleDataModel): boolean => {
      return (
        !schedule.isCorrupted &&
        schedule.schedule_info.month_number === month &&
        schedule.schedule_info.year === year
      );
    },
    [month, year]
  );

  const currentMonthPastRevisions = past.filter(isCurrentNotCorruptedSchedule);

  const isPreviousVersionAvailable =
    currentMonthPastRevisions.length >= MINIMUM_UNDO_COUNT_TO_REVERT_NORMAL_SCHEDULE;

  const fetchPrevScheduleVersion = (): void => {
    // This is the schedule which caused corruption.
    const lastNotCorrupted = past.findIndex(isCurrentNotCorruptedSchedule);
    const numberOfUndo = lastNotCorrupted + MINIMUM_UNDO_COUNT_TO_REVERT_NORMAL_SCHEDULE;

    for (let i = 0; i < numberOfUndo; i++) {
      dispatch(UndoActionCreator.undo(PERSISTENT_SCHEDULE_UNDOABLE_CONFIG));
    }
  };
  const mgLoadNew = isPreviousVersionAvailable ? MSG_LOAD_AGAIN_TOO : MSG_LOAD_AGAIN;

  return (
    <div className={"newMonthComponents"}>
      <img id="corrupted_img" src={sadEmoji} alt="" />
      <pre>{MSG_UNABLE_TO_LOAD_SCHEDULE}</pre>
      {isPreviousVersionAvailable && (
        <Button onClick={fetchPrevScheduleVersion} variant="primary" data-cy="restore-prev-version">
          {MSG_RESTORE_PREV}
        </Button>
      )}
      <pre>{mgLoadNew}</pre>
      <EmptyMonthButtons />
    </div>
  );
}
