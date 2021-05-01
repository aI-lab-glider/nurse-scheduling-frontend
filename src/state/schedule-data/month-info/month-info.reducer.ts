/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import { ScheduleDataModel } from "../schedule-data.model";
import { MonthInfoModel } from "./month-info.model";
import { scheduleDataInitialState } from "../schedule-data-initial-state";
import { createActionName, ScheduleActionModel, ScheduleActionType } from "../schedule.actions";

let uuid = 0;

export function scheduleInfoReducerF(name: string) {
  return (
    state: MonthInfoModel = scheduleDataInitialState.schedule_info,
    action: ScheduleActionModel
  ): MonthInfoModel => {
    switch (action.type) {
      case createActionName(name, ScheduleActionType.ADD_NEW):
        const { schedule_info: scheduleInfo } = action.payload as ScheduleDataModel;
        uuid += 1;
        if (!scheduleInfo) return state;
        return { ...scheduleInfo, UUID: uuid.toString() };
      case createActionName(name, ScheduleActionType.UPDATE):
        const { schedule_info } = action.payload as ScheduleDataModel;
        if (!schedule_info) return state;
        return { ...state, ...schedule_info };
      default:
        return state;
    }
  };
}
