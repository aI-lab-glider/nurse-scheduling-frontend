/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */

import { FoundationInfoModel } from "./foundation-info.model";
import { FoundationInfoAction, FoundationInfoActionType } from "./foundation-info.action-creator";
import { scheduleDataInitialState } from "../schedule-data-initial-state";
import {
  createActionName,
  isScheduleAction,
  ScheduleActionModel,
  ScheduleActionType,
} from "../schedule.actions";
import * as _ from "lodash";

export function foundationInfoReducerF(name: string) {
  return (
    state: FoundationInfoModel = scheduleDataInitialState.month_info,
    action: ScheduleActionModel | FoundationInfoAction
  ): FoundationInfoModel => {
    switch (action.type) {
      case createActionName(name, ScheduleActionType.ADD_NEW):
      case createActionName(name, ScheduleActionType.UPDATE):
        if (!isScheduleAction(action)) {
          return state;
        }
        const monthInfo = action.payload?.month_info;
        if (!monthInfo) {
          return state;
        }
        return { ...monthInfo };
      case createActionName(name, FoundationInfoActionType.UPDATE_CHILDREN_AND_EXTRAWORKERS):
        const data = (action as FoundationInfoAction).payload;
        if (_.isNil(data)) {
          return state;
        }
        const { extraWorkers, childrenNumber } = data;
        /* eslint-disable @typescript-eslint/camelcase */
        return {
          ...state,
          extra_workers: [...extraWorkers],
          children_number: [...childrenNumber],
        };
      default:
        return state;
    }
  };
}
