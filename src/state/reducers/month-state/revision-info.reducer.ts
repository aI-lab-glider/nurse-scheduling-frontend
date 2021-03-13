/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */

import { RevisionType, ThunkFunction } from "../../../api/persistance-store.model";
import { ActionModel } from "../../models/action.model";
import { ScheduleDataActionCreator } from "./schedule-data/schedule-data.action-creator";
import { cropScheduleDMToMonthDM } from "../../../logic/schedule-container-convertion/schedule-container-convertion";

export enum RevisionReducerAction {
  CHANGE_REVISION = "CHANGE_REVISION",
}

export class RevisionReducerActionCreator {
  static changeRevision(newRevisionType: RevisionType): ThunkFunction<unknown> {
    return async (dispatch, getState): Promise<void> => {
      const actualSchedule = getState().actualState.persistentSchedule.present;
      const actualMonthDM = cropScheduleDMToMonthDM(actualSchedule);

      const setRevisionAction = ScheduleDataActionCreator.setScheduleStateAndCreateIfNeeded(
        actualMonthDM.scheduleKey,
        actualMonthDM,
        newRevisionType
      );

      dispatch({
        type: RevisionReducerAction.CHANGE_REVISION,
        payload: newRevisionType,
      });
      dispatch(setRevisionAction);
    };
  }
}

export function revisionInfoReducer(
  state: RevisionType = "actual",
  action: ActionModel<RevisionType>
): RevisionType {
  switch (action.type) {
    case RevisionReducerAction.CHANGE_REVISION:
      if (!action.payload) {
        return state;
      }
      return action.payload;
    default:
      return state;
  }
}
