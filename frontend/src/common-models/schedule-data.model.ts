import { WorkerInfoModel } from "./worker-info.model";
import { MonthInfoModel } from "./month-info.model";
import { ScheduleModel } from "./schedule.model";
import { ShiftInfoModel } from "./shift-info.model";

export interface ScheduleDataModel {
  schedule_info?: ScheduleModel;
  month_info?: MonthInfoModel;
  employee_info?: WorkerInfoModel;
  shifts?: ShiftInfoModel;
  isNew?: boolean;
}
