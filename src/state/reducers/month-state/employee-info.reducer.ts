/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import _ from "lodash";
import { ScheduleDataModel } from "../../../common-models/schedule-data.model";
import { ContractType, WorkersInfoModel } from "../../../common-models/worker-info.model";
import { WorkerInfoExtendedInterface } from "../../../components/namestable/worker-edit.component";
import { ShiftHelper } from "../../../helpers/shifts.helper";
import { ActionModel } from "../../models/action.model";
import { scheduleDataInitialState } from "./schedule-data/schedule-data-initial-state";
import {
  AddNewWorkerActionPayload,
  UpdateNewWorkerActionPayload,
} from "./schedule-data/schedule-data.action-creator";
import {
  createActionName,
  ScheduleActionModel,
  ScheduleActionType,
} from "./schedule-data/schedule.actions";

function fromFractionToHours(fraction: string): number {
  const result = fraction.split("/");
  const [dividend, divisor] = result.map((string) => Number.parseInt(string));
  return dividend / divisor;
}

function getEmployeeWorkTime({
  contractType,
  employmentTime,
  employmentTimeOther,
  civilTime,
  monthNumber,
  year,
}: UpdateNewWorkerActionPayload): number {
  if (monthNumber === undefined || year === undefined) {
    throw Error("Month number and year are required");
  }
  switch (contractType) {
    case ContractType.EMPLOYMENT_CONTRACT:
      const timeAsFraction =
        (employmentTime === "inne" ? employmentTimeOther : employmentTime) ?? "0/1";
      return fromFractionToHours(timeAsFraction);
    case ContractType.CIVIL_CONTRACT:
      const requiredHoursForMonth = ShiftHelper.calculateWorkNormForMonth(monthNumber, year);
      return parseInt(civilTime) / requiredHoursForMonth;
    default:
      return 0;
  }
}

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
    action:
      | ScheduleActionModel
      | ActionModel<WorkerInfoExtendedInterface>
      | ActionModel<UpdateNewWorkerActionPayload>
      | ActionModel<AddNewWorkerActionPayload>
  ): WorkersInfoModel => {
    let monthEmployeeInfo: WorkersInfoModel;
    let workerName, prevName, workerType, contractType;
    if ((action.payload as WorkerInfoExtendedInterface) !== undefined) {
      ({
        workerName,
        prevName,
        workerType,
        contractType,
      } = action.payload as WorkerInfoExtendedInterface);
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

      case ScheduleActionType.DELETE_WORKER:
        delete state.time[workerName];
        delete state.type[workerName];
        delete state.contractType?.[workerName];
        return {
          time: { ...state.time },
          type: { ...state.type },
          contractType: { ...state.contractType },
        };
      case ScheduleActionType.ADD_NEW_WORKER:
        return {
          time: {
            [workerName]: getEmployeeWorkTime(action.payload as AddNewWorkerActionPayload),
            ...state.time,
          },
          type: { [workerName]: workerType, ...state.type },
          contractType: { [workerName]: contractType, ...state.contractType },
        };
      case ScheduleActionType.MODIFY_WORKER:
        delete state.time[prevName];
        delete state.type[prevName];
        delete state.contractType?.[workerName];
        return {
          time: {
            [workerName]: getEmployeeWorkTime(action.payload as UpdateNewWorkerActionPayload),
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
