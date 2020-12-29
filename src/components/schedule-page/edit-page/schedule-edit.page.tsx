import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { ApplicationStateModel } from "../../../state/models/application-state.model";
import { ScheduleComponent } from "../table/schedule/schedule.component";
import { ScheduleLogicContext, useScheduleState } from "../table/schedule/use-schedule-state";
import { EditPageToolbar } from "./edit-page-toolbar.component";

interface ScheduleEditPageOptions {
  closeEdit: () => void;
}

export function ScheduleEditPage(options: ScheduleEditPageOptions): JSX.Element {
  const scheduleModel = useSelector((state: ApplicationStateModel) => state.scheduleData.present);
  const { scheduleLogic, setNewSchedule, scheduleLocalState } = useScheduleState(
    scheduleModel,
    "edit"
  );
  useEffect(() => {
    setNewSchedule(scheduleModel);
  }, [scheduleModel, setNewSchedule]);

  return (
    <>
      <ScheduleLogicContext.Provider value={scheduleLogic}>
        <EditPageToolbar closeEdit={options.closeEdit} />
        <div className="schedule">
          <ScheduleComponent schedule={scheduleLocalState} />
        </div>
      </ScheduleLogicContext.Provider>
    </>
  );
}
