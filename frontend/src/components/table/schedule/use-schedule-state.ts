import React, { useCallback, useState } from "react";
import { useDispatch } from "react-redux";
import { ScheduleLogic } from "../../../logic/schedule-logic/schedule.logic";
import { ScheduleDataModel } from "../../../common-models/schedule-data.model";
import { ScheduleComponentState, scheduleInitialState } from "./schedule-state.model";

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
        nurseShiftsSection: logic.getNurseInfo().sectionData,
        babysitterShiftsSection: logic.getBabySitterInfo().sectionData,
        childrenSection: logic.getChildrenInfo().sectionData,
        extraWorkersSection: logic.getExtraWorkersInfo().sectionData,
        dateSection: logic.getMetadata().sectionData,
        isInitialized: true,
        scheduleLogic: logic,
        uuid: scheduleModel.schedule_info?.UUID?.toString() || "",
      });
    },
    [dispatchGlobalState]
  );

  return { scheduleLocalState, setNewSchedule };
}
