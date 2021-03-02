/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import { ScheduleDataModel } from "../../../common-models/schedule-data.model";
import { ShiftInfoModel } from "../../../common-models/shift-info.model";
import { scheduleDataInitialState } from "./schedule-data/schedule-data-initial-state";
import {
  createActionName,
  ScheduleActionModel,
  ScheduleActionType,
} from "./schedule-data/schedule.actions";
import { ActionModel } from "../../models/action.model";
import { WorkerActionPayload } from "../worker.action-creator";

export function scheduleShiftsInfoReducerF(name: string) {
  return (
    state: ShiftInfoModel = scheduleDataInitialState.shifts,
    action: ScheduleActionModel | ActionModel<WorkerActionPayload>
  ): ShiftInfoModel => {
    let updatedShifts;
    if (action.payload as WorkerActionPayload) {
      ({ updatedShifts } = action.payload as WorkerActionPayload);
    }
    switch (action.type) {
      case createActionName(name, ScheduleActionType.ADD_NEW):
      case createActionName(name, ScheduleActionType.UPDATE):
        const data = (action.payload as ScheduleDataModel)?.shifts;
        return { ...data };
      case ScheduleActionType.UPDATE_WORKER_INFO:
        return {
          ...updatedShifts,
        };
      default:
        return state;
    }
  };
}
