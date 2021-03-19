/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import React from "react";
import { ApplicationStateModel } from "../../../state/models/application-state.model";
import { PERSISTENT_SCHEDULE_UNDOABLE_CONFIG } from "../../../state/reducers/month-state/schedule-data/schedule.actions";
import { UndoableHotkeys } from "../../common-components";
import { ScheduleLogicContext, useScheduleState } from "../table/schedule/use-schedule-state";
import { ViewOnlyToolbar } from "./view-only-toolbar";
import { ScheduleContainerComponent } from "../schedule-container.component";

interface ScheduleViewOnlyPageOptions {
  openEdit: () => void;
}

export function ScheduleViewOnlyPage(props: ScheduleViewOnlyPageOptions): JSX.Element {
  const { scheduleLogic, scheduleLocalState } = useScheduleState(
    (state: ApplicationStateModel) => state.actualState.persistentSchedule.present,
    "readonly"
  );

  return (
    <>
      <UndoableHotkeys config={PERSISTENT_SCHEDULE_UNDOABLE_CONFIG} />
      <ScheduleLogicContext.Provider value={scheduleLogic}>
        <ViewOnlyToolbar openEdit={props.openEdit} />
        <div className={"schedule"}>
          <ScheduleContainerComponent schedule={scheduleLocalState} />
        </div>
      </ScheduleLogicContext.Provider>
    </>
  );
}
