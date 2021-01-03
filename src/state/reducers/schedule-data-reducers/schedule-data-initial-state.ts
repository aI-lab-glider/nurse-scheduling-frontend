import { MonthInfoModel } from "../../../common-models/month-info.model";
import { ScheduleModel } from "../../../common-models/schedule.model";
import { ShiftInfoModel } from "../../../common-models/shift-info.model";
import { WorkersInfoModel } from "../../../common-models/worker-info.model";

/* eslint-disable @typescript-eslint/camelcase */
const employeeInfoinitialState: WorkersInfoModel = { time: {}, type: {} };
const monthInfoinitialState: MonthInfoModel = {
  frozen_shifts: [],
  dates: [],
};
export const scheduleInfoInitialState: ScheduleModel = {
  daysFromPreviousMonthExists: false,
};
export const shiftInfoInitialState: ShiftInfoModel = {};

export const scheduleDataInitialState = {
  schedule_info: scheduleInfoInitialState,
  month_info: monthInfoinitialState,
  employee_info: employeeInfoinitialState,
  shifts: shiftInfoInitialState,
};
