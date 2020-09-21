import { DataRow } from "../../../logic/real-schedule-logic/data-row";

export enum ScheduleActionType {
  UpdateNurseShiftSection = "updateNurseShiftSection",
  UpdateBabysitterShiftSection = "updateBabysitterShiftSection",
  UpdateFullState = "updateFullState",
  UpdateChildrenShiftSection = "updateChildrenShiftSection",
}

export interface ScheduleComponentState {
  childrenSection?: DataRow[];
  nurseShiftsSection?: DataRow[];
  babysitterShiftsSection?: DataRow[];
  dateSection?: DataRow[];
  isScheduleModified?: boolean;
}

export const scheduleInitialState: ScheduleComponentState = {
  nurseShiftsSection: [],
  babysitterShiftsSection: [],
  childrenSection: [],
  isScheduleModified: false,
};
