/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */

import { ScheduleDataModel } from "../../../common-models/schedule-data.model";
import { ActionModel } from "../../models/action.model";
import { WorkersInfoModel } from "../../../common-models/worker-info.model";
import { scheduleDataInitialState } from "./schedule-data/schedule-data-initial-state";
import { CopyMonthActionPayload } from "./schedule-data/schedule-data.action-creator";
import {
  ScheduleActionModel,
  createActionName,
  ScheduleActionType,
} from "./schedule-data/schedule.actions";

/* eslint-disable @typescript-eslint/camelcase */
export function employeeInfoReducerF(name: string) {
  return (
    state: WorkersInfoModel = scheduleDataInitialState.employee_info,
    action: ScheduleActionModel | ActionModel<CopyMonthActionPayload>
  ): WorkersInfoModel => {
    let data;
    let workerName, prevName, workerType, employmentTime;
    if (action.payload?.worker) {
      ({ workerName, prevName, workerType, employmentTime } = action.payload?.worker);
    }

    switch (action.type) {
      case createActionName(name, ScheduleActionType.ADD_NEW):
        data = (action.payload as ScheduleDataModel)?.employee_info;
        if (!data) return state;
        return { ...data };
      case createActionName(name, ScheduleActionType.UPDATE):
        data = (action.payload as ScheduleDataModel)?.employee_info;
        if (!data) return state;
        return { ...state, ...data };
      case createActionName(name, ScheduleActionType.COPY_TO_MONTH):
        data = (action.payload as CopyMonthActionPayload).scheduleData.employee_info;
        return { ...data };
      case ScheduleActionType.ADD_NEW_WORKER:
        return {
          time: {
            [workerName]: [employmentTime],
            ...state.time,
          },
          type: { [workerName]: workerType, ...state.type },
        };
      case ScheduleActionType.MODIFY_WORKER:
        delete state.time[prevName];
        delete state.type[prevName];
        return {
          time: {
            [workerName]: [employmentTime],
            ...state.time,
          },
          type: { [workerName]: workerType, ...state.type },
        };
      default:
        return state;
    }
  };
}
