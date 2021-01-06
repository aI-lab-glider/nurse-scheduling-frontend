/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */

import { WorkersInfoModel } from "../../../common-models/worker-info.model";
import { scheduleDataInitialState } from "./schedule-data/schedule-data-initial-state";
import {
  ScheduleActionModel,
  createActionName,
  ScheduleActionType,
} from "./schedule-data/schedule.actions";

/* eslint-disable @typescript-eslint/camelcase */
export function employeeInfoReducerF(name: string) {
  return (
    state: WorkersInfoModel = scheduleDataInitialState.employee_info,
    action: ScheduleActionModel
  ): WorkersInfoModel => {
    const data = action.payload?.employee_info;
    if (!data) return state;
    switch (action.type) {
      case createActionName(name, ScheduleActionType.ADD_NEW):
        return { ...data };
      case createActionName(name, ScheduleActionType.UPDATE):
        return { ...state, ...data };
      default:
        return state;
    }
  };
}
