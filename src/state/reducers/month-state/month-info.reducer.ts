/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */

import { ScheduleKey } from "../../../api/persistance-store.model";
import { MonthInfoModel } from "../../../common-models/month-info.model";
import { ActionModel } from "../../models/action.model";
import { copyMonthInfo } from "./schedule-data/common-reducers";
import { scheduleDataInitialState } from "./schedule-data/schedule-data-initial-state";
import {
  ScheduleActionModel,
  createActionName,
  ScheduleActionType,
  isScheduleAction,
} from "./schedule-data/schedule.actions";

export function monthInfoReducerF(name: string) {
  return (
    state: MonthInfoModel = scheduleDataInitialState.month_info,
    action: ScheduleActionModel | ActionModel<ScheduleKey>
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
      case createActionName(name, ScheduleActionType.COPY_TO_MONTH):
        const { month, year } = action.payload as ScheduleKey;
        return copyMonthInfo(month, year, state);
      default:
        return state;
    }
  };
}
