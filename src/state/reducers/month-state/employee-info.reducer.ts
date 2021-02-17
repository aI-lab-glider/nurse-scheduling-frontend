/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import { ScheduleDataModel } from "../../../common-models/schedule-data.model";
import { WorkersInfoModel } from "../../../common-models/worker-info.model";
import { scheduleDataInitialState } from "./schedule-data/schedule-data-initial-state";
import { WorkerInfoExtendedInterface } from "../../../components/namestable/worker-edit.component";
import {
  createActionName,
  ScheduleActionModel,
  ScheduleActionType,
} from "./schedule-data/schedule.actions";
import { ActionModel } from "../../models/action.model";

function fromFractionToHours(fraction: string): number {
  const result = fraction.split("/");
  const [dividend, divisor] = result.map((string) => Number.parseInt(string));
  return dividend / divisor;
}
/* eslint-disable @typescript-eslint/camelcase */
export function employeeInfoReducerF(name: string) {
  return (
    state: WorkersInfoModel = scheduleDataInitialState.employee_info,
    action: ScheduleActionModel | ActionModel<WorkerInfoExtendedInterface>
  ): WorkersInfoModel => {
    let data;
    let workerName, prevName, workerType, contractType, employmentTime;
    if ((action.payload as WorkerInfoExtendedInterface) !== undefined) {
      ({
        workerName,
        prevName,
        workerType,
        contractType,
        employmentTime,
      } = action.payload as WorkerInfoExtendedInterface);
    }

    switch (action.type) {
      case ScheduleActionType.DELETE_WORKER:
        delete state.time[workerName];
        delete state.type[workerName];
        return {
          time: { ...state.time },
          type: { ...state.type },
          contractType: { ...state.contractType },
        };

      case createActionName(name, ScheduleActionType.ADD_NEW):
        data = (action.payload as ScheduleDataModel)?.employee_info;
        if (!data) return state;
        return { ...data };
      case createActionName(name, ScheduleActionType.UPDATE):
        data = (action.payload as ScheduleDataModel)?.employee_info;
        if (!data) return state;
        return { ...state, ...data };
      case ScheduleActionType.ADD_NEW_WORKER:
        return {
          time: {
            [workerName]: fromFractionToHours(employmentTime),
            ...state.time,
          },
          type: { [workerName]: workerType, ...state.type },
          contractType: { [workerName]: contractType, ...state.contractType },
        };
      case ScheduleActionType.MODIFY_WORKER:
        delete state.time[prevName];
        delete state.type[prevName];
        return {
          time: {
            [workerName]: fromFractionToHours(employmentTime),
            ...state.time,
          },
          type: { [workerName]: workerType, ...state.type },
          contractType: { [workerName]: contractType, ...state.contractType },
        };
      default:
        return state;
    }
  };
}
