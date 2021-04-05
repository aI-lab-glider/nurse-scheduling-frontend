/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import { ScheduleDataModel } from "../../models/common-models/schedule-data.model";
import { Shift, ShiftCode, ShiftInfoModel } from "../../models/common-models/shift-info.model";
import { scheduleDataInitialState } from "../schedule-data-initial-state";
import { createActionName, ScheduleActionModel, ScheduleActionType } from "../schedule.actions";
import { ActionModel } from "../../models/action.model";
import { WorkerActionPayload } from "../worker-info/worker.action-creator";
import * as _ from "lodash";

export function scheduleShiftsInfoReducerF(name: string) {
  return (
    state: ShiftInfoModel = scheduleDataInitialState.shifts,
    action:
      | ScheduleActionModel
      | ActionModel<WorkerActionPayload>
      | ActionModel<Shift>
      | ActionModel<Array<Shift>>
  ): ShiftInfoModel => {
    switch (action.type) {
      case createActionName(name, ScheduleActionType.ADD_NEW):
      case createActionName(name, ScheduleActionType.UPDATE):
        const data = (action.payload as ScheduleDataModel)?.shifts;
        return _.cloneDeep(data);

      case ScheduleActionType.DELETE_SHIFT:
        const { code } = action.payload as Shift;
        Object.entries(state).forEach(([workerName, workersShifts]) => {
          state[workerName] = workersShifts.map((shiftCodeInArray) =>
            shiftCodeInArray === code ? ShiftCode.W : shiftCodeInArray
          );
        });
        return state;
      case ScheduleActionType.MODIFY_SHIFT:
        const shiftArray = action.payload as Array<Shift>;

        const newShift = shiftArray[0];
        const oldShift = shiftArray[1];
        if (newShift.code !== oldShift.code) {
          delete state[oldShift.code];
        }
        Object.entries(state).forEach(([key, value]) => {
          state[key] = value.map((shiftCodeInArray) =>
            shiftCodeInArray === oldShift.code ? (newShift.code as ShiftCode) : shiftCodeInArray
          );
        });
        return state;

      default:
        return state;
    }
  };
}
