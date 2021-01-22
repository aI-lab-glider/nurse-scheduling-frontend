/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import _ from "lodash";
import { GroupedScheduleErrors, ScheduleError } from "../../../common-models/schedule-error.model";
import { ActionModel } from "../../models/action.model";

export enum ScheduleErrorActionType {
  UPDATE = "updateScheduleError",
}

export function scheduleErrorsReducer(
  state: GroupedScheduleErrors = {},
  action: ActionModel<ScheduleError[]>
): GroupedScheduleErrors {
  switch (action.type) {
    case ScheduleErrorActionType.UPDATE:
      if (!action.payload) action.payload = [];
      const errors = _.groupBy(action.payload, (item) => item.kind);
      return errors;
    default:
      return state;
  }
}
