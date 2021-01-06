/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */

import { ScheduleKey } from "../../../api/persistance-store.model";
import { ScheduleDataModel } from "../../../common-models/schedule-data.model";
import { ShiftInfoModel } from "../../../common-models/shift-info.model";
import { ActionModel } from "../../models/action.model";
import { cropShiftsToMonth } from "./schedule-data/common-reducers";
import { scheduleDataInitialState } from "./schedule-data/schedule-data-initial-state";
import {
  ScheduleActionModel,
  createActionName,
  ScheduleActionType,
} from "./schedule-data/schedule.actions";

export function scheduleShiftsInfoReducerF(name: string) {
  return (
    state: ShiftInfoModel = scheduleDataInitialState.shifts,
    action: ScheduleActionModel | ActionModel<ScheduleKey>
  ): ShiftInfoModel => {
    switch (action.type) {
      case createActionName(name, ScheduleActionType.ADD_NEW):
      case createActionName(name, ScheduleActionType.UPDATE):
        const data = (action.payload as ScheduleDataModel)?.shifts;
        return { ...data };
      case createActionName(name, ScheduleActionType.COPY_TO_MONTH):
        const { month, year } = action.payload as ScheduleKey;
        return cropShiftsToMonth(month, year, state);

      default:
        return state;
    }
  };
}
