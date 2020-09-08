import { ScheduleDataModel } from "./schedule-data/schedule-data.model";

export interface ApplicationStateModel {
  uploadedScheduleSheet?: Array<Object>;
  scheduleData?: ScheduleDataModel;
}
