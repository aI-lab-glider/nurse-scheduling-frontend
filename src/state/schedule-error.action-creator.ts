/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */

import { ThunkFunction } from "../api/persistance-store.model";
import {
  AlgorithmErrorCode,
  WorkerOvertime,
  WorkerUnderTime,
} from "../common-models/schedule-error.model";
import { ActionModel } from "./models/action.model";
import { ScheduleErrorActionType } from "./reducers/month-state/schedule-errors.reducer";

export type ScheduleErrorUpdateOvertimOrUndertimePayload = WorkerUnderTime | WorkerOvertime;

export interface RemoveWorkerErrorUpdateOvertimOrUndertimePayload {
  workerName: string;
}

export class ScheduleErrorActionCreator {
  public static addUndertimeOrOvertimeError(
    timeDiff: number,
    worker: string
  ): ThunkFunction<unknown> {
    return (dispatch): void => {
      const type =
        timeDiff > 0 ? AlgorithmErrorCode.WorkerOvertime : AlgorithmErrorCode.WorkerUnderTime;

      const removeAction = this.clearWorkerOverTime(worker);
      const addAction = {
        type: ScheduleErrorActionType.ADD_OVERTIME_OR_UNDERTIME,
        payload: {
          kind: type,
          hours: timeDiff,
          worker,
        },
      };
      dispatch(removeAction);
      dispatch(addAction);
    };
  }

  public static clearWorkerOverTime(
    worker: string
  ): ActionModel<RemoveWorkerErrorUpdateOvertimOrUndertimePayload> {
    return {
      type: ScheduleErrorActionType.REMOVE_WORKER_OVERTIME_ERROR,
      payload: {
        workerName: worker,
      },
    };
  }
}
