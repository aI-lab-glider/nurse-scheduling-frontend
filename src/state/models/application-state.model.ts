import { ScheduleDataModel } from "../../common-models/schedule-data.model";
import { ScheduleErrorMessageModel } from "../../common-models/schedule-error-message.model";
import { StateWithHistory } from "redux-undo";
export interface MonthStateModel {
  persistentSchedule: StateWithHistory<ScheduleDataModel>;
  temporarySchedule: StateWithHistory<ScheduleDataModel>;
  scheduleErrors?: ScheduleErrorMessageModel[];
}

export type HistoryStateModel = { [scheduleKey: string]: MonthStateModel };
export interface ApplicationStateModel {
  actualState: MonthStateModel;
  history: HistoryStateModel;
}
