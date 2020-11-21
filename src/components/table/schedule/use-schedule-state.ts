import React, { useCallback, useState } from "react";
import { useDispatch } from "react-redux";
import { ScheduleLogic } from "../../../logic/schedule-logic/schedule.logic";
import { ScheduleDataModel } from "../../../common-models/schedule-data.model";
import { ScheduleComponentState, scheduleInitialState } from "./schedule-state.model";
import { ShiftsInfoLogic } from "../../../logic/schedule-logic/shifts-info.logic";
import { ChildrenInfoLogic } from "../../../logic/schedule-logic/children-info.logic";
import { ExtraWorkersLogic } from "../../../logic/schedule-logic/extra-workers.logic";
import { MetadataLogic } from "../../../logic/schedule-logic/metadata.logic";
import { LocalStorageProvider } from "../../../api/local-storage-provider.model";

// eslint-disable-next-line @typescript-eslint/class-name-casing
export interface useScheduleStateReturn {
  scheduleLogic: ScheduleLogic;
  scheduleLocalState: ScheduleComponentState;
  setNewSchedule: (scheduleModel: ScheduleDataModel) => void;
}

export const ScheduleLogicContext = React.createContext<ScheduleLogic | null>(null);

export function useScheduleState(
  initialScheduleModelState: ScheduleDataModel
): useScheduleStateReturn {
  const dispatchGlobalState = useDispatch();
  const [scheduleLocalState, setScheduleLocalState] = useState<ScheduleComponentState>(
    scheduleInitialState
  );

  const scheduleLogic = useState<ScheduleLogic>(
    new ScheduleLogic(dispatchGlobalState, new LocalStorageProvider(), initialScheduleModelState)
  )[0];

  const setNewSchedule = useCallback(
    (scheduleModel: ScheduleDataModel): void => {
      scheduleLogic.update(scheduleModel);
      setScheduleLocalState({
        nurseShiftsSection: (scheduleLogic.sections.NurseInfo as ShiftsInfoLogic).sectionData,
        babysitterShiftsSection: (scheduleLogic.sections.BabysitterInfo as ShiftsInfoLogic)
          .sectionData,
        childrenSection: (scheduleLogic.sections.ChildrenInfo as ChildrenInfoLogic).sectionData,
        extraWorkersSection: (scheduleLogic.sections.ExtraWorkersInfo as ExtraWorkersLogic)
          .sectionData,
        dateSection: (scheduleLogic.sections.Metadata as MetadataLogic).sectionData,
        isInitialized: true,
        uuid: scheduleModel.schedule_info?.UUID?.toString() || "",
      });
    },
    [scheduleLogic]
  );

  return { scheduleLogic, scheduleLocalState, setNewSchedule };
}
