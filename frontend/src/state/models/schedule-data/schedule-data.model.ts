import { EmployeeInfoModel } from "./employee-info.model";
import { MonthInfoModel } from "./month-info.model";
import { ScheduleInfoModel } from "./schedule-info.model";
import { ShiftInfoModel } from "./shift-info.model";

export interface ScheduleDataModel {
  schedule_info?: ScheduleInfoModel;
  month_info?: MonthInfoModel;
  employee_info?: EmployeeInfoModel;
  shifts?: ShiftInfoModel;
}
