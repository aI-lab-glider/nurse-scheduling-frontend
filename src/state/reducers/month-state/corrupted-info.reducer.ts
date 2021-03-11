/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import {
  createActionName,
  isScheduleAction,
  ScheduleActionModel,
  ScheduleActionType,
} from "./schedule-data/schedule.actions";
import { ActionModel } from "../../models/action.model";
import { scheduleDataInitialState } from "./schedule-data/schedule-data-initial-state";

export function corruptedInfoReducerF(name: string) {
  return (
    state: boolean = scheduleDataInitialState.isCorrupted,
    action: ActionModel<boolean> | ScheduleActionModel
  ): boolean => {
    switch (action.type) {
      case createActionName(name, ScheduleActionType.ADD_NEW):
      case createActionName(name, ScheduleActionType.UPDATE):
        if (!isScheduleAction(action)) {
          return state;
        }
        return action.payload?.isCorrupted ?? false;
      case ScheduleActionType.SET_SCHEDULE_CORRUPTED:
        return true;
      default:
        return state;
    }
  };
}
