/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import { ScheduleDataModel } from "../../../common-models/schedule-data.model";
import { ShiftInfoModel } from "../../../common-models/shift-info.model";
import { scheduleDataInitialState } from "./schedule-data/schedule-data-initial-state";
import {
  createActionName,
  ScheduleActionType,
  ScheduleActionModel,
} from "./schedule-data/schedule.actions";
import { ActionModel } from "../../models/action.model";
import { WorkerInfoExtendedInterface } from "../../../components/namestable/worker-edit.component";

export function scheduleShiftsInfoReducerF(name: string) {
  return (
    state: ShiftInfoModel = scheduleDataInitialState.shifts,
    action: ScheduleActionModel | ActionModel<WorkerInfoExtendedInterface>
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
      case ScheduleActionType.ADD_NEW_WORKER:
        const newShiftsArr = [...Array(35).fill("W")];
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
