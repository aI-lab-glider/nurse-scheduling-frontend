/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import React from "react";
import { EmptyMonthButtons } from "./empty-month-buttons";
import sadEmoji from "../../assets/images/sadEmoji.svg";
import { useDispatch, useSelector } from "react-redux";
import { ApplicationStateModel } from "../../state/models/application-state.model";
import { UndoActionCreator } from "../../state/reducers/undoable.action-creator";
import { PERSISTENT_SCHEDULE_UNDOABLE_CONFIG } from "../../state/reducers/month-state/schedule-data/schedule.actions";
import { Button } from "../common-components";

const MINIMUM_CORRUPTED_SCHEDULES_IN_PAST = 2; // schedule which caused corruption and the same schedule with isCorrupted=true
const MG_UNABLE_TO_LOAD_SCHEDULE = "Nie można wyświetlić zapisanego grafiku";
const MG_RESTORE_PREV = "Przywróć poprzednią wersję grafiku";
const MG_LOAD_AGAIN = "Wczytaj ponownie grafik";
const MG_LOAD_AGAIN_TOO = "Możesz też wczytać grafik ponownie";

export function CorruptedScheduleComponent(): JSX.Element {
  const dispatch = useDispatch();
  const { past } = useSelector(
    (state: ApplicationStateModel) => state.actualState.persistentSchedule
  );
  const isPreviousVersionAvailable = past.length > MINIMUM_CORRUPTED_SCHEDULES_IN_PAST; // ;

  const fetchPrevScheduleVersion = (): void => {
    // This is the schedule which caused corruption.
    const lastNotCorrupted = past.findIndex((schedule) => {
      return !schedule.isCorrupted;
    });
    const numberOfUndo = lastNotCorrupted + MINIMUM_CORRUPTED_SCHEDULES_IN_PAST;
    for (let i = 0; i < numberOfUndo; i++) {
      dispatch(UndoActionCreator.undo(PERSISTENT_SCHEDULE_UNDOABLE_CONFIG));
    }
  };
  const mgLoadNew = isPreviousVersionAvailable ? MG_LOAD_AGAIN_TOO : MG_LOAD_AGAIN;

  return (
    <div className={"newMonthComponents"}>
      <img id="corrupted_img" src={sadEmoji} alt="" />
      <pre>{MG_UNABLE_TO_LOAD_SCHEDULE}</pre>
      {isPreviousVersionAvailable && (
        <>
          <Button onClick={fetchPrevScheduleVersion} variant="primary">
            {MG_RESTORE_PREV}
          </Button>
        </>
      )}
      <pre>{mgLoadNew}</pre>
      <EmptyMonthButtons />
    </div>
  );
}
