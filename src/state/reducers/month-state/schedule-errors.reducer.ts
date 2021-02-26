/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import _ from "lodash";
import {
  AlgorithmErrorCode,
  GroupedScheduleErrors,
  ScheduleError,
} from "../../../common-models/schedule-error.model";
import { PERSISTENT_SCHEDULE_NAME } from "../../app.reducer";
import { ActionModel } from "../../models/action.model";
import {
  RemoveWorkerErrorUpdateOvertimOrUndertimePayload,
  ScheduleErrorUpdateOvertimOrUndertimePayload,
} from "../../schedule-error.action-creator";
import { createActionName, ScheduleActionType } from "./schedule-data/schedule.actions";
/* eslint-disable @typescript-eslint/no-explicit-any */

export enum ScheduleErrorActionType {
  UPDATE = "updateScheduleError",
  REMOVE_WORKER_OVERTIME_ERROR = "REMOVE_WORKER_OVERTIME_ERROR",
  ADD_OVERTIME_OR_UNDERTIME = "ADD_OVERTIME_OR_UNDERTIME",
}

export function scheduleErrorsReducer(
  state: GroupedScheduleErrors = {},
  action:
    | ActionModel<ScheduleError[]>
    | ActionModel<ScheduleErrorUpdateOvertimOrUndertimePayload>
    | ActionModel<RemoveWorkerErrorUpdateOvertimOrUndertimePayload>
): GroupedScheduleErrors {
  switch (action.type) {
    case ScheduleErrorActionType.UPDATE:
      if (!action.payload) action.payload = [];
      const errors = _.groupBy(action.payload as ScheduleError[], (item) => item.kind);
      return errors;

    case createActionName(PERSISTENT_SCHEDULE_NAME, ScheduleActionType.ADD_NEW):
    case ScheduleActionType.CLEAN_ERRORS:
      // In case if new schedule is added we should remove errors, that previously existed
      return {};

    case ScheduleErrorActionType.REMOVE_WORKER_OVERTIME_ERROR:
      const { workerName } = action.payload as RemoveWorkerErrorUpdateOvertimOrUndertimePayload;
      const removeFromState = (
        code: AlgorithmErrorCode.WorkerOvertime | AlgorithmErrorCode.WorkerUnderTime
      ): void => {
        const matchingIndex = state[code]?.findIndex((p) => p.worker === workerName);
        if (!_.isNil(matchingIndex) && matchingIndex !== -1) {
          delete state[code]?.[matchingIndex];
          state[code] = (state[code] as any[]).filter((el) => !!el);
        }
      };
      removeFromState(AlgorithmErrorCode.WorkerOvertime);
      removeFromState(AlgorithmErrorCode.WorkerUnderTime);
      return _.cloneDeep(state);

    case ScheduleErrorActionType.ADD_OVERTIME_OR_UNDERTIME:
      const {
        kind,
        hours,
        worker,
      } = action.payload as ScheduleErrorUpdateOvertimOrUndertimePayload;
      if (state[kind] === undefined) {
        state[kind] = [];
      }
      const error = {
        kind,
        hours,
        worker,
      };
      state[kind]!.push(error as any);

      return _.cloneDeep(state);

    default:
      return state;
  }
}
