import { ScheduleDataModel } from "./schedule-data/schedule-data.model";
import { ScheduleErrorModel } from "./schedule-data/schedule-error.model";

export interface ApplicationStateModel {
  uploadedScheduleSheet?: Array<Object>;
  scheduleData?: ScheduleDataModel;
  scheduleErrors?: ScheduleErrorModel[];
}
