/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */

import { ScheduleMetadata } from "../../../common-models/schedule.model";
import { scheduleDataInitialState } from "./schedule-data/schedule-data-initial-state";
import {
  ScheduleActionModel,
  createActionName,
  ScheduleActionType,
} from "./schedule-data/schedule.actions";

let uuid = 0;

/* eslint-disable @typescript-eslint/camelcase */

export function scheduleInfoReducerF(name: string) {
  return (
    state: ScheduleMetadata = scheduleDataInitialState.schedule_info,
    action: ScheduleActionModel
  ): ScheduleMetadata => {
    const data = action.payload?.schedule_info;
    switch (action.type) {
      case createActionName(name, ScheduleActionType.ADD_NEW):
        uuid += 1;
        if (!data) return state;
        return { ...data, UUID: uuid.toString() };
      case createActionName(name, ScheduleActionType.UPDATE):
        if (!data) return state;
        return { ...state, ...data };
      case createActionName(name, ScheduleActionType.COPY_TO_MONTH):
        const { month_number, year } = (action.payload as unknown) as {
          month_number: number;
          year: number;
        };
        return { ...state, month_number, year };
      default:
        return state;
    }
  };
}
