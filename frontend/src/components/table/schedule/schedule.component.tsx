import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ActionModel } from "../../../state/models/action.model";
import { ApplicationStateModel } from "../../../state/models/application-state.model";
import { WorkerType } from "../../../state/models/schedule-data/employee-info.model";
import { ScheduleDataModel } from "../../../state/models/schedule-data/schedule-data.model";
import { ScheduleDataActionType } from "../../../state/reducers/schedule-data.reducer";
import { ScheduleRowComponent } from "./schedule-parts/schedule-row.component";
import { ScheduleActionType } from "./schedule-state.model";
import "./schedule.component.css";
import { ChildrenSectionComponent } from "./sections/children-section/children-section.components";
import { DateSectionComponent } from "./sections/date-section/date-section.component";
import { ShiftsSectionComponent } from "./sections/shifts-section/shifts-section";
import { useScheduleState } from "./use-schedule-state";

export function ScheduleComponent() {
  const scheduleModel = useSelector((state: ApplicationStateModel) => state.scheduleData);
  const dispatchGlobalState = useDispatch();
  const [scheduleState, dispatchScheduleState, setNewSchedule, scheduleLogic] = useScheduleState();

  useEffect(() => {
    if (scheduleState.isScheduleModified && scheduleLogic) {
      dispatchGlobalState({
        type: ScheduleDataActionType.UPDATE,
        payload: scheduleLogic.schedule.getDataModel(),
      } as ActionModel<ScheduleDataModel>);
    }
  }, [scheduleState, dispatchGlobalState, scheduleLogic]);

  useEffect(() => {
    if (scheduleModel?.isNew) {
      setNewSchedule(scheduleModel);
    }
  }, [scheduleModel]);

  return (
    <table className="table">
      <tbody>
        <DateSectionComponent
          data={scheduleState.dateSection}
          metaDataLogic={scheduleLogic?.getMetadata()}
          onSectionUpdated={(newSectionData) => {
            // TODO implement
          }}
        />

        <ScheduleRowComponent />

        <ChildrenSectionComponent
          data={scheduleState.childrenSection}
          metaDataLogic={scheduleLogic?.getMetadata()}
          onSectionUpdated={(newSectionData) =>
            dispatchScheduleState({
              type: ScheduleActionType.UpdateChildrenShiftSection,
              payload: { childrenSection: newSectionData },
            })
          }
        />

        <ScheduleRowComponent />

        <ShiftsSectionComponent
          workerType={WorkerType.NURSE}
          data={scheduleState.nurseShiftsSection}
          metaDataLogic={scheduleLogic?.getMetadata()}
          onSectionUpdated={(newSectionData) =>
            dispatchScheduleState({
              type: ScheduleActionType.UpdateNurseShiftSection,
              payload: { nurseShiftsSection: newSectionData },
            })
          }
        />

        <ScheduleRowComponent />

        <ShiftsSectionComponent
          workerType={WorkerType.OTHER}
          data={scheduleState.babysitterShiftsSection}
          metaDataLogic={scheduleLogic?.getMetadata()}
          onSectionUpdated={(newSectionData) =>
            dispatchScheduleState({
              type: ScheduleActionType.UpdateBabysitterShiftSection,
              payload: { babysitterShiftsSection: newSectionData },
            })
          }
        />
      </tbody>
    </table>
  );
}
