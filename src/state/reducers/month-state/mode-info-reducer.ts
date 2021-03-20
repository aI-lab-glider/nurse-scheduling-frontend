/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */

import { ActionModel } from "../../models/action.model";
import { ScheduleMode } from "../../../components/schedule-page/table/schedule/schedule-state.model";

export enum ModeInfoReducer {
  SET_MODE = "SET_MODE",
}

export type ModeInfoActionModel = ActionModel<ScheduleMode>;

export class ModeInfoActionCreator {
  static setMode(mode: ScheduleMode): ActionModel<ScheduleMode> {
    return {
      type: ModeInfoReducer.SET_MODE,
      payload: mode,
    };
  }
}

export function modeInfoReducer(
  state: ScheduleMode = ScheduleMode.Readonly,
  action: ModeInfoActionModel
): ScheduleMode {
  switch (action.type) {
    case ModeInfoReducer.SET_MODE:
      if (!action.payload) {
        return state;
      }
      return action.payload;
    default:
      return state;
  }
}
