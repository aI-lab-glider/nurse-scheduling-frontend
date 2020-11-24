import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { ApplicationStateModel } from "../../../../state/models/application-state.model";
import { WorkerType } from "../../../../common-models/worker-info.model";
import { EmptyRowComponent } from "./schedule-parts/empty-row.component";
import { DateSectionComponent } from "./sections/date-section/date-section.component";
import { ShiftsSectionComponent } from "./sections/shifts-section/shifts-section.component";
import { ScheduleLogicContext, useScheduleState } from "./use-schedule-state";
import { ShiftInfoSectionComponent } from "./sections/shift-info-section/shift-info-section.components";

export function ScheduleComponent(): JSX.Element {
  const scheduleModel = useSelector((state: ApplicationStateModel) => state.scheduleData.present);

  const { scheduleLogic, scheduleLocalState, setNewSchedule } = useScheduleState(scheduleModel);

  useEffect(() => {
    setNewSchedule(scheduleModel);
  }, [scheduleModel, setNewSchedule]);

  return (
    <React.Fragment>
      {scheduleLocalState.isInitialized && (
        <table className="table">
          <tbody>
            <ScheduleLogicContext.Provider value={scheduleLogic}>
              <DateSectionComponent
                uuid={scheduleLocalState.uuid}
                data={scheduleLocalState.dateSection}
              />

              <EmptyRowComponent />

              <ShiftInfoSectionComponent
                uuid={scheduleLocalState.uuid}
                data={scheduleLocalState.foundationInfoSection}
              />

              <ShiftsSectionComponent
                uuid={scheduleLocalState.uuid}
                workerType={WorkerType.NURSE}
                data={scheduleLocalState.nurseShiftsSection}
              />

              <EmptyRowComponent />

              <ShiftsSectionComponent
                uuid={scheduleLocalState.uuid}
                workerType={WorkerType.OTHER}
                data={scheduleLocalState.babysitterShiftsSection}
              />
            </ScheduleLogicContext.Provider>
          </tbody>
        </table>
      )}
    </React.Fragment>
  );
}
