/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */

import { ScheduleDataModel } from "../../../common-models/schedule-data.model";
import { WorkersInfoModel } from "../../../common-models/worker-info.model";
import { scheduleDataInitialState } from "./schedule-data/schedule-data-initial-state";
import {
  createActionName,
  ScheduleActionModel,
  ScheduleActionType,
} from "./schedule-data/schedule.actions";

/* eslint-disable @typescript-eslint/camelcase */
export function employeeInfoReducerF(name: string) {
  return (
    state: WorkersInfoModel = scheduleDataInitialState.employee_info,
    action: ScheduleActionModel
  ): WorkersInfoModel => {
    let data;
    switch (action.type) {
      case createActionName(name, ScheduleActionType.ADD_NEW):
        data = (action.payload as ScheduleDataModel)?.employee_info;
        if (!data) return state;
        return { ...data };
      case createActionName(name, ScheduleActionType.UPDATE):
        data = (action.payload as ScheduleDataModel)?.employee_info;
        if (!data) return state;
        return { ...state, ...data };
      default:
        return state;
    }
  };
}
