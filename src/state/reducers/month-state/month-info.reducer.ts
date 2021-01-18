/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */

import { MonthInfoModel } from "../../../common-models/month-info.model";
import { scheduleDataInitialState } from "./schedule-data/schedule-data-initial-state";
import {
  createActionName,
  isScheduleAction,
  ScheduleActionModel,
  ScheduleActionType,
} from "./schedule-data/schedule.actions";

export function monthInfoReducerF(name: string) {
  return (
    state: MonthInfoModel = scheduleDataInitialState.month_info,
    action: ScheduleActionModel
  ): MonthInfoModel => {
    switch (action.type) {
      case createActionName(name, ScheduleActionType.ADD_NEW):
      case createActionName(name, ScheduleActionType.UPDATE):
        if (!isScheduleAction(action)) {
          return state;
        }
        const data = action.payload?.month_info;
        if (!data) {
          return state;
        }
        return { ...data };
      default:
        return state;
    }
  };
}
