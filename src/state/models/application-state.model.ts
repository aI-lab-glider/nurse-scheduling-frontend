import { ScheduleDataModel } from "../../common-models/schedule-data.model";
import { ScheduleErrorMessageModel } from "../../common-models/schedule-error-message.model";

export interface ApplicationStateModel {
  scheduleData?: ScheduleDataModel;
  scheduleErrors?: ScheduleErrorMessageModel[];
}
