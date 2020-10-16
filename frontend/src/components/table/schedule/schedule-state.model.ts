import { DataRow } from "../../../logic/schedule-logic/data-row";
import { ScheduleLogic } from "../../../logic/schedule-logic/schedule.logic";

export enum ScheduleActionType {
  UpdateNurseShiftSection = "updateNurseShiftSection",
  UpdateBabysitterShiftSection = "updateBabysitterShiftSection",
  UpdateFullState = "updateFullState",
  UpdateChildrenShiftSection = "updateChildrenShiftSection",
  UpdateExtraWorkersSection = "updateExtraWorkersSection",
}

export interface ScheduleComponentState {
  childrenSection?: DataRow[];
  extraWorkersSection?: DataRow[];
  nurseShiftsSection?: DataRow[];
  babysitterShiftsSection?: DataRow[];
  dateSection?: DataRow[];
  isInitialized?: boolean;
  scheduleLogic: ScheduleLogic | null;
  uuid: string;
}

export const scheduleInitialState: ScheduleComponentState = {
  nurseShiftsSection: [],
  babysitterShiftsSection: [],
  extraWorkersSection: [],
  childrenSection: [],
  dateSection: [],
  isInitialized: false,
  scheduleLogic: null,
  uuid: "",
};
