/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import { ScheduleDataModel } from "../../../common-models/schedule-data.model";
import { ShiftCode, ShiftInfoModel } from "../../../common-models/shift-info.model";
import { scheduleDataInitialState } from "./schedule-data/schedule-data-initial-state";
import {
  createActionName,
  ScheduleActionType,
  ScheduleActionModel,
} from "./schedule-data/schedule.actions";
import { ActionModel } from "../../models/action.model";
import { WorkerInfoExtendedInterface } from "../../../components/namestable/worker-edit.component";
import { AddNewWorkerActionPayload } from "./schedule-data/schedule-data.action-creator";

export function scheduleShiftsInfoReducerF(name: string) {
  return (
    state: ShiftInfoModel = scheduleDataInitialState.shifts,
    action:
      | ScheduleActionModel
      | ActionModel<WorkerInfoExtendedInterface>
      | ActionModel<AddNewWorkerActionPayload>
  ): ShiftInfoModel => {
    let workerName, prevName;
    if (action.payload as WorkerInfoExtendedInterface) {
      ({ workerName, prevName } = action.payload as WorkerInfoExtendedInterface);
    }
    switch (action.type) {
      case createActionName(name, ScheduleActionType.ADD_NEW):
      case createActionName(name, ScheduleActionType.UPDATE):
        const data = (action.payload as ScheduleDataModel)?.shifts;
        return { ...data };
      case ScheduleActionType.DELETE_WORKER:
        delete state[workerName];
        return { ...state };
      case ScheduleActionType.ADD_NEW_WORKER:
        const { dayCountInMonth } = action.payload as AddNewWorkerActionPayload;
        const newShiftsArr = [...Array(dayCountInMonth).fill(ShiftCode.W)];
        return { ...{ [workerName]: newShiftsArr }, ...state };
      case ScheduleActionType.MODIFY_WORKER:
        const shiftsArr = state[prevName];
        delete state[prevName];
        return { ...{ [workerName]: shiftsArr }, ...state };

      default:
        return state;
    }
  };
}
