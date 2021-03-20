/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import _ from "lodash";
import { ScheduleDataModel } from "../../../common-models/schedule-data.model";
import { ContractType, WorkersInfoModel } from "../../../common-models/worker-info.model";
import { ActionModel } from "../../models/action.model";
import { WorkerActionPayload } from "../worker.action-creator";
import { scheduleDataInitialState } from "./schedule-data/schedule-data-initial-state";
import {
  createActionName,
  ScheduleActionModel,
  ScheduleActionType,
} from "./schedule-data/schedule.actions";

function mockWorkerContractType(workerInfo: WorkersInfoModel): WorkersInfoModel {
  if (_.isNil(workerInfo.contractType)) {
    workerInfo.contractType = {};
  }
  Object.keys(workerInfo.time).forEach((key) => {
    workerInfo.contractType![key] = ContractType.EMPLOYMENT_CONTRACT;
  });
  return workerInfo;
}
/* eslint-disable @typescript-eslint/camelcase */
export function employeeInfoReducerF(name: string) {
  return (
    state: WorkersInfoModel = scheduleDataInitialState.employee_info,
    action: ScheduleActionModel | ActionModel<WorkerActionPayload>
  ): WorkersInfoModel => {
    let monthEmployeeInfo: WorkersInfoModel;
    let updatedEmployeeInfo;
    if ((action.payload as WorkerActionPayload) !== undefined) {
      ({ updatedEmployeeInfo } = action.payload as WorkerActionPayload);
    }
    switch (action.type) {
      case createActionName(name, ScheduleActionType.ADD_NEW):
        monthEmployeeInfo = (action.payload as ScheduleDataModel)?.employee_info;
        if (!monthEmployeeInfo) return state;
        monthEmployeeInfo = mockWorkerContractType(monthEmployeeInfo);
        return { ...monthEmployeeInfo };
      case createActionName(name, ScheduleActionType.UPDATE):
        monthEmployeeInfo = (action.payload as ScheduleDataModel)?.employee_info;
        if (!monthEmployeeInfo) return state;
        monthEmployeeInfo = mockWorkerContractType(monthEmployeeInfo);
        return { ...state, ...monthEmployeeInfo };
      case ScheduleActionType.UPDATE_WORKER_INFO:
        return {
          ...updatedEmployeeInfo,
        };
      default:
        return state;
    }
  };
}
