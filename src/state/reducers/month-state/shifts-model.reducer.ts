/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */

import {
  createActionName,
  ScheduleActionModel,
  ScheduleActionType,
} from "./schedule-data/schedule.actions";
import { Shift, ShiftsTypesDict } from "../../../common-models/shift-info.model";
import { ActionModel } from "../../models/action.model";
import { scheduleDataInitialState } from "./schedule-data/schedule-data-initial-state";
import { ScheduleDataModel } from "../../../common-models/schedule-data.model";
import * as _ from "lodash";

export function shiftsModelReducerF(name: string) {
  return (
    state: ShiftsTypesDict = scheduleDataInitialState.shift_types,
    action: ScheduleActionModel | ActionModel<Shift> | ActionModel<Array<Shift>>
  ): ShiftsTypesDict => {
    if (!action.payload) {
      return state;
    }
    switch (action.type) {
      case createActionName(name, ScheduleActionType.ADD_NEW):
      case createActionName(name, ScheduleActionType.UPDATE):
        const shiftTypes = (action.payload as ScheduleDataModel)?.shift_types;
        return _.cloneDeep(shiftTypes);
      case ScheduleActionType.MODIFY_SHIFT:
        const shiftArray = action.payload as Array<Shift>;
        const newShift = shiftArray[0];
        const oldShift = shiftArray[1];
        if (newShift.code !== oldShift.code) {
          delete state[oldShift.code];
        }
        return { ...state, [newShift.code]: newShift };

      case ScheduleActionType.ADD_NEW_SHIFT:
        const data = action.payload as Shift;
        return { ...state, [data.code]: data };

      case ScheduleActionType.DELETE_SHIFT:
        const dataToDel = action.payload as Shift;
        delete state[dataToDel.code];
        return { ...state };

      default:
        return state;
    }
  };
}
