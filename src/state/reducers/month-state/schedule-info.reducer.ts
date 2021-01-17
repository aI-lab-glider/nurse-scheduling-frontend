/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import { ActionModel } from "../../models/action.model";
import { ScheduleMetadata } from "../../../common-models/schedule.model";
import { scheduleDataInitialState } from "./schedule-data/schedule-data-initial-state";
import { CopyMonthActionPayload } from "./schedule-data/schedule-data.action-creator";
import {
  ScheduleActionModel,
  createActionName,
  ScheduleActionType,
} from "./schedule-data/schedule.actions";
import { ScheduleDataModel } from "../../../common-models/schedule-data.model";

let uuid = 0;

/* eslint-disable @typescript-eslint/camelcase */

export function scheduleInfoReducerF(name: string) {
  return (
    state: ScheduleMetadata = scheduleDataInitialState.schedule_info,
    action: ScheduleActionModel | ActionModel<CopyMonthActionPayload>
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
      // case createActionName(name, ScheduleActionType.COPY_TO_MONTH):
      //   const { month, year } = action.payload as CopyMonthActionPayload;
      //   return { month_number: month, year };
      default:
        return state;
    }
  };
}
