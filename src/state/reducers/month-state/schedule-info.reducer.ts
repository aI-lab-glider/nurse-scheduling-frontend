/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import { ScheduleDataModel } from "../../../common-models/schedule-data.model";
import { ScheduleMetadata } from "../../../common-models/schedule.model";
import { scheduleDataInitialState } from "./schedule-data/schedule-data-initial-state";
import {
  createActionName,
  ScheduleActionModel,
  ScheduleActionType,
} from "./schedule-data/schedule.actions";
let uuid = 0;

/* eslint-disable @typescript-eslint/camelcase */

export function scheduleInfoReducerF(name: string) {
  return (
    state: ScheduleMetadata = scheduleDataInitialState.schedule_info,
    action: ScheduleActionModel
  ): ScheduleMetadata => {
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
