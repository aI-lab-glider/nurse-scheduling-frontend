import { DataRow } from "../../../../logic/schedule-logic/data-row";

export interface ScheduleComponentState {
  childrenSection?: DataRow[];
  extraWorkersSection?: DataRow[];
  nurseShiftsSection?: DataRow[];
  babysitterShiftsSection?: DataRow[];
  dateSection?: DataRow[];
  isInitialized?: boolean;
  uuid: string;
}

export const scheduleInitialState: ScheduleComponentState = {
  nurseShiftsSection: [],
  babysitterShiftsSection: [],
  extraWorkersSection: [],
  childrenSection: [],
  dateSection: [],
  isInitialized: false,
  uuid: "",
};
