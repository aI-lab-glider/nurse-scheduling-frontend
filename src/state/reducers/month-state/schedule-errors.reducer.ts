/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import _ from "lodash";
import { ScheduleErrorMessageModel } from "../../../common-models/schedule-error-message.model";
import { GroupedScheduleErrors, ScheduleError } from "../../../common-models/schedule-error.model";
import { ActionModel } from "../../models/action.model";
import { ScheduleActionType } from "./schedule-data/schedule.actions";

export enum ScheduleErrorActionType {
  UPDATE = "updateScheduleError",
}

export function scheduleErrorsReducer(
  state: GroupedScheduleErrors = {},
  action: ActionModel<ScheduleError[] | ScheduleErrorMessageModel>
): GroupedScheduleErrors {
  switch (action.type) {
    case ScheduleErrorActionType.UPDATE:
      if (!action.payload) action.payload = [];
      const response = action.payload as ScheduleError[];
      const errors = _.groupBy(response, (item) => item.kind);
      return errors;
    case ScheduleActionType.SHOW_ERROR:
      let s = _.cloneDeep(state);
      s = _.forEach(s, (v) => {
        return _.forEach(v, (e) => {
          if (e.isVisible) {
            e.isVisible = false;
          }
          return e;
        });
      });
      if (action.payload) {
        const error = action.payload as ScheduleErrorMessageModel;
        s[error.kind][error.index].isVisible = !s[error.kind][error.index].isVisible;
      }
      return s;
    case ScheduleActionType.CLEAN_ERRORS:
      // In case if new schedule is added we should remove errors, that previously existed
      return {};
    default:
      return state;
  }
}
