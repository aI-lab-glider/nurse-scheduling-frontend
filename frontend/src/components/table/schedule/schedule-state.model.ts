import { DataRow } from "../../../logic/real-schedule-logic/data-row";

export enum ScheduleActionType {
  UpdateNurseShiftSection = "updateNurseShiftSection",
  UpdateBabysitterShiftSection = "updateBabysitterShiftSection",
  UpdateFullState = "updateFullState",
  UpdateChildrenShiftSection = "updateChildrenShiftSection",
  UpdateExtraWorkersSection = "updateExtraWorkersSection"
}

export interface ScheduleComponentState {
  childrenSection?: DataRow[];
  extraWorkersSection?: DataRow[];
  nurseShiftsSection?: DataRow[];
  babysitterShiftsSection?: DataRow[];
  dateSection?: DataRow[];
  isScheduleModified?: boolean;
}

export const scheduleInitialState: ScheduleComponentState = {
  nurseShiftsSection: [],
  babysitterShiftsSection: [],
  extraWorkersSection: [],
  childrenSection: [],
  isScheduleModified: false,
};
