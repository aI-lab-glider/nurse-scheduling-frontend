/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */

import { ScheduleKey } from "../../../api/persistance-store.model";
import { ScheduleDataModel } from "../../../common-models/schedule-data.model";
import { ScheduleModel } from "../../../common-models/schedule.model";
import { ActionModel } from "../../models/action.model";
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
    state: ScheduleModel = scheduleDataInitialState.schedule_info,
    action: ScheduleActionModel | ActionModel<ScheduleKey>
  ): ScheduleModel => {
    let data: ScheduleModel;
    switch (action.type) {
      case createActionName(name, ScheduleActionType.ADD_NEW):
        data = (action.payload as ScheduleDataModel).schedule_info;
        uuid += 1;
        if (!data) return state;
        return { ...data, UUID: uuid.toString() };
      case createActionName(name, ScheduleActionType.UPDATE):
        data = (action.payload as ScheduleDataModel).schedule_info;
        if (!data) return state;
        return { ...state, ...data };
      case createActionName(name, ScheduleActionType.COPY_TO_MONTH):
        const { month, year } = action.payload as ScheduleKey;
        return { ...state, month_number: month, year };
      default:
        return state;
    }
  };
}
