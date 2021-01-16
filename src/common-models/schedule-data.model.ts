/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import { WorkersInfoModel } from "./worker-info.model";
import { MonthInfoModel } from "./month-info.model";
import { ScheduleModel } from "./schedule.model";
import { ShiftInfoModel } from "./shift-info.model";
import _ from "lodash";

export interface ScheduleDataModel {
  schedule_info: ScheduleModel;
  month_info: MonthInfoModel;
  employee_info: WorkersInfoModel;
  shifts: ShiftInfoModel;
}

export function isScheduleModelEmpty(scheduleModel: ScheduleDataModel): boolean {
  const requiredFields: (keyof ScheduleDataModel)[] = ["employee_info", "month_info", "shifts"];
  return requiredFields.every((field) => {
    const requiredObject = scheduleModel[field];
    return Object.values(requiredObject).every((field) => _.isEmpty(field));
  });
}
