import { ScheduleDataModel } from "../../common-models/schedule-data.model";
import { ScheduleErrorMessageModel } from "../../common-models/schedule-error-message.model";
import { StateWithHistory } from "redux-undo";

export interface ApplicationStateModel {
  scheduleData?: StateWithHistory<ScheduleDataModel>;
  scheduleErrors?: ScheduleErrorMessageModel[];
}
