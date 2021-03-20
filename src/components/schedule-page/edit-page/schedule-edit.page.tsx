/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import React from "react";
import { ApplicationStateModel } from "../../../state/models/application-state.model";
import { ScheduleLogicContext, useScheduleState } from "../table/schedule/use-schedule-state";
import { EditPageToolbar } from "./edit-page-toolbar.component";
import { UndoableHotkeys } from "../../common-components";
import { TEMPORARY_SCHEDULE_UNDOABLE_CONFIG } from "../../../state/reducers/month-state/schedule-data/schedule.actions";
import { ScheduleContainerComponent } from "../schedule-container.component";

interface ScheduleEditPageOptions {
  close: () => void;
}

export function ScheduleEditPage(options: ScheduleEditPageOptions): JSX.Element {
  const { scheduleLogic, scheduleLocalState } = useScheduleState(
    (state: ApplicationStateModel) => state.actualState.temporarySchedule.present,
    "edit"
  );

  return (
    <>
      <UndoableHotkeys config={TEMPORARY_SCHEDULE_UNDOABLE_CONFIG} />
      <ScheduleLogicContext.Provider value={scheduleLogic}>
        <EditPageToolbar close={options.close} />
        <div className="schedule">
          <ScheduleContainerComponent schedule={scheduleLocalState} />
        </div>
      </ScheduleLogicContext.Provider>
    </>
  );
}
