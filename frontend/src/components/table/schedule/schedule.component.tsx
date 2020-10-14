import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { DataRow } from "../../../logic/real-schedule-logic/data-row";
import { ApplicationStateModel } from "../../../state/models/application-state.model";
import { WorkerType } from "../../../state/models/schedule-data/employee-info.model";
import { ScheduleRowComponent } from "./schedule-parts/schedule-row.component";
import "./schedule.component.css";
import { ChildrenSectionComponent } from "./sections/children-section/children-section.components";
import { DateSectionComponent } from "./sections/date-section/date-section.component";
import { ShiftsSectionComponent } from "./sections/shifts-section/shifts-section";
import { ScheduleLogicContext, useScheduleState } from "./use-schedule-state";

export function ScheduleComponent() {
  const scheduleModel = useSelector(
    (state: ApplicationStateModel) => state.scheduleData,
    (left, right) => left?.schedule_info?.UUID === right?.schedule_info?.UUID
  );

  const { scheduleLocalState, setNewSchedule } = useScheduleState();

  useEffect(() => {
    if (scheduleModel?.isNew) {
      setNewSchedule(scheduleModel);
    }
  }, [scheduleModel]);

  return (
    <React.Fragment>
      {scheduleLocalState.isInitialized && (
        <table className="table">
          <tbody>
            <ScheduleLogicContext.Provider value={scheduleLocalState.scheduleLogic}>
              <DateSectionComponent data={scheduleLocalState.dateSection} />

              <ScheduleRowComponent index={0} dataRow={new DataRow("", [])} />

              <ChildrenSectionComponent data={scheduleLocalState.childrenSection} />

              <ScheduleRowComponent index={0} dataRow={new DataRow("", [])} />

              <ExtraWorkersSection
                data={scheduleState.extraWorkersSection}
                metaDataLogic={scheduleLogic?.getMetadata()}
                onSectionUpdated={(newSectionData) =>
                  dispatchScheduleState({
                    type: ScheduleActionType.UpdateExtraWorkersSection,
                    payload: { extraWorkersSection: newSectionData },
                  })
                }
              />

              <ShiftsSectionComponent
                workerType={WorkerType.NURSE}
                data={scheduleLocalState.nurseShiftsSection}
              />

              <ScheduleRowComponent index={0} dataRow={new DataRow("", [])} />

              <ShiftsSectionComponent
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
