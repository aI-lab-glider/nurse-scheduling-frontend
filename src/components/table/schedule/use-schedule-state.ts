import React, { useCallback, useState } from "react";
import { useDispatch } from "react-redux";
import { ScheduleLogic } from "../../../logic/schedule-logic/schedule.logic";
import { ScheduleDataModel } from "../../../common-models/schedule-data.model";
import { ScheduleComponentState, scheduleInitialState } from "./schedule-state.model";
import { ShiftsInfoLogic } from "../../../logic/schedule-logic/shifts-info.logic";
import { ChildrenInfoLogic } from "../../../logic/schedule-logic/children-info.logic";
import { ExtraWorkersLogic } from "../../../logic/schedule-logic/extra-workers.logic";
import { MetadataLogic } from "../../../logic/schedule-logic/metadata.logic";

// eslint-disable-next-line @typescript-eslint/class-name-casing
export interface useScheduleStateReturn {
  scheduleLocalState: ScheduleComponentState;
  setNewSchedule: (scheduleModel: ScheduleDataModel) => void;
}

export const ScheduleLogicContext = React.createContext<ScheduleLogic | null>(null);

export function useScheduleState(): useScheduleStateReturn {
  const dispatchGlobalState = useDispatch();
  const [scheduleLocalState, setScheduleLocalState] = useState<ScheduleComponentState>(
    scheduleInitialState
  );

  const setNewSchedule = useCallback(
    (scheduleModel: ScheduleDataModel): void => {
      const logic = new ScheduleLogic(scheduleModel, dispatchGlobalState);
      setScheduleLocalState({
        nurseShiftsSection: (logic.sections.NurseInfo as ShiftsInfoLogic).sectionData,
        babysitterShiftsSection: (logic.sections.BabysitterInfo as ShiftsInfoLogic).sectionData,
        childrenSection: (logic.sections.ChildrenInfo as ChildrenInfoLogic).sectionData,
        extraWorkersSection: (logic.sections.ExtraWorkersInfo as ExtraWorkersLogic).sectionData,
        dateSection: (logic.sections.Metadata as MetadataLogic).sectionData,
        isInitialized: true,
        scheduleLogic: logic,
        uuid: scheduleModel.schedule_info?.UUID?.toString() || "",
      });
    },
    [dispatchGlobalState]
  );

  return { scheduleLocalState, setNewSchedule };
}
