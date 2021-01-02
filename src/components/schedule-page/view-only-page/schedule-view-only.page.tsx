import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { ApplicationStateModel } from "../../../state/models/application-state.model";
import { ScheduleComponent } from "../table/schedule/schedule.component";
import { ScheduleLogicContext, useScheduleState } from "../table/schedule/use-schedule-state";
import { ViewOnlyToolbar } from "./view-only-toolbar";

interface ScheduleViewOnlyPageOptions {
  openEdit: () => void;
}

export function ScheduleViewOnlyPage(props: ScheduleViewOnlyPageOptions): JSX.Element {
  const scheduleModel = useSelector((state: ApplicationStateModel) => {
    return state.actualRevision.present;
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
      <ScheduleLogicContext.Provider value={scheduleLogic}>
        <ViewOnlyToolbar openEdit={props.openEdit} />
        <div className={"schedule"}>
          <ScheduleComponent schedule={scheduleLocalState} />
        </div>
      </ScheduleLogicContext.Provider>
    </>
  );
}
