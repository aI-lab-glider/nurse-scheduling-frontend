/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */

import { TEMPORARY_SCHEDULE_NAME } from "../../../app.reducer";
import { ActionModel } from "../../../models/action.model";
import { createActionName } from "./schedule.actions";

export enum FoundationInfoActionType {
  UPDATE_CHILDREN_AND_EXTRAWORKERS = "UPDATE_CHILDREN_AND_EXTRAWORKERS",
}

export type FoundationInfoAction = ActionModel<UpdateChildrenAndExtraworkersPayload>;

interface UpdateChildrenAndExtraworkersPayload {
  extraWorkers: number[];
  childrenNumber: number[];
}
export class FoundationInfoActionCreator {
  public static updateFoundationInfo(
    childrenNumber: number[],
    extraWorkers: number[]
  ): FoundationInfoAction {
    return {
      type: createActionName(
        TEMPORARY_SCHEDULE_NAME,
        FoundationInfoActionType.UPDATE_CHILDREN_AND_EXTRAWORKERS
      ),
      payload: {
        extraWorkers,
        childrenNumber,
      },
    };
  }
}
