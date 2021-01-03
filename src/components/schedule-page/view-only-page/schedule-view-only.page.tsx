import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { ApplicationStateModel } from "../../../state/models/application-state.model";
import { ScheduleComponent } from "../table/schedule/schedule.component";
import { ScheduleLogicContext, useScheduleState } from "../table/schedule/use-schedule-state";
import { ViewOnlyToolbar } from "./view-only-toolbar";
import { UndoableHotkeys } from "../../common-components";
import { PERSISTENT_SCHEDULE_UNDOABLE_CONFIG } from "../../../state/reducers/schedule-data-reducers/persistent-schedule.reducer";

interface ScheduleViewOnlyPageOptions {
  openEdit: () => void;
}

export function ScheduleViewOnlyPage(props: ScheduleViewOnlyPageOptions): JSX.Element {
  const scheduleModel = useSelector((state: ApplicationStateModel) => {
    return state.persistentSchedule.present;
  });
  const { scheduleLogic, setNewSchedule, scheduleLocalState } = useScheduleState(
    scheduleModel,
    "readonly"
  );
  useEffect(() => {
    setNewSchedule(scheduleModel);
  }, [scheduleModel, setNewSchedule]);

  return (
    <>
      <UndoableHotkeys config={PERSISTENT_SCHEDULE_UNDOABLE_CONFIG} />
      <ScheduleLogicContext.Provider value={scheduleLogic}>
        <ViewOnlyToolbar openEdit={props.openEdit} />
        <div className={"schedule"}>
          <ScheduleComponent schedule={scheduleLocalState} />
        </div>
      </ScheduleLogicContext.Provider>
    </>
  );
}
