/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import _ from "lodash";
import { ScheduleDataModel } from "../../models/common-models/schedule-data.model";
import { WorkersInfoModel } from "../../models/common-models/worker-info.model";
import {
  DEFAULT_CONTRACT_TYPE,
  DEFAULT_WORKER_GROUP,
} from "../../../logic/schedule-parser/workers-info.parser";
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
    let monthEmployeeInfo: WorkersInfoModel;
    switch (action.type) {
      case createActionName(name, ScheduleActionType.ADD_NEW):
        monthEmployeeInfo = (action.payload as ScheduleDataModel)?.employee_info;
        if (!monthEmployeeInfo) return state;
        monthEmployeeInfo = preprocessWorkerInfoModel(monthEmployeeInfo);
        return { ...monthEmployeeInfo };

      case createActionName(name, ScheduleActionType.UPDATE):
        monthEmployeeInfo = (action.payload as ScheduleDataModel)?.employee_info;
        if (!monthEmployeeInfo) return state;
        monthEmployeeInfo = preprocessWorkerInfoModel(monthEmployeeInfo);
        return { ...state, ...monthEmployeeInfo };
      default:
        return state;
    }
  };
}

/* eslint-disable @typescript-eslint/no-explicit-any */
function fillWorkerInfoWithDefaultValue(
  workerInfo: WorkersInfoModel,
  workerNames: string[],
  sectionName: keyof WorkersInfoModel,
  defaultValue: any
): void {
  if (_.isNil(workerInfo[sectionName])) {
    workerInfo[sectionName] = {};
  }
  workerNames.forEach((workerName) => {
    if (_.isNil(workerInfo[sectionName]![workerName])) {
      workerInfo[sectionName]![workerName] = defaultValue;
    }
  });
}

function preprocessWorkerInfoModel(workerInfo: WorkersInfoModel): WorkersInfoModel {
  workerInfo = _.cloneDeep(workerInfo);
  const workerNames = Object.keys(workerInfo.type);
  fillWorkerInfoWithDefaultValue(workerInfo, workerNames, "contractType", DEFAULT_CONTRACT_TYPE);
  fillWorkerInfoWithDefaultValue(workerInfo, workerNames, "workerGroup", DEFAULT_WORKER_GROUP);
  return workerInfo;
}
