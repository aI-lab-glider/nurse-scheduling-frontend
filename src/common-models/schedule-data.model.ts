/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import { WorkersInfoModel } from "./worker-info.model";
import { MonthInfoModel } from "./month-info.model";
import { ScheduleModel } from "./schedule.model";
import { ShiftInfoModel } from "./shift-info.model";

export interface ScheduleDataModel {
  schedule_info: ScheduleModel;
  month_info: MonthInfoModel;
  employee_info: WorkersInfoModel;
  shifts: ShiftInfoModel;
  isNew?: boolean;
}
