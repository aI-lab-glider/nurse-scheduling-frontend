/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */

import { ScheduleDataModel } from "../../../common-models/schedule-data.model";
import { ShiftInfoModel } from "../../../common-models/shift-info.model";
import { ActionModel } from "../../models/action.model";
import { copyShiftstoMonth } from "./schedule-data/common-reducers";
import { scheduleDataInitialState } from "./schedule-data/schedule-data-initial-state";
import { CopyMonthActionPayload } from "./schedule-data/schedule-data.action-creator";
import {
  ScheduleActionModel,
  createActionName,
  ScheduleActionType,
} from "./schedule-data/schedule.actions";

export function scheduleShiftsInfoReducerF(name: string) {
  return (
    state: ShiftInfoModel = scheduleDataInitialState.shifts,
    action: ScheduleActionModel | ActionModel<CopyMonthActionPayload>
  ): ShiftInfoModel => {
    switch (action.type) {
      case createActionName(name, ScheduleActionType.ADD_NEW):
      case createActionName(name, ScheduleActionType.UPDATE):
        const data = (action.payload as ScheduleDataModel)?.shifts;
        return { ...data };
      case createActionName(name, ScheduleActionType.COPY_TO_MONTH):
        const { month, year, scheduleData } = action.payload as CopyMonthActionPayload;

        return copyShiftstoMonth(month, year, scheduleData.shifts);

      default:
        return state;
    }
  };
}
