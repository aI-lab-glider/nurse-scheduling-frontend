import { DataRow } from "../../../../logic/schedule-logic/data-row";

export interface ScheduleComponentState {
  foundationInfoSection?: DataRow[];
  nurseShiftsSection?: DataRow[];
  babysitterShiftsSection?: DataRow[];
  dateSection?: DataRow[];
  isInitialized?: boolean;
  uuid: string;
}

export const scheduleInitialState: ScheduleComponentState = {
  nurseShiftsSection: [],
  babysitterShiftsSection: [],
  foundationInfoSection: [],
  dateSection: [],
  isInitialized: false,
  uuid: "",
};
