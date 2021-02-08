/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */

import { RevisionType, ThunkFunction } from "../../../api/persistance-store.model";
import { ActionModel } from "../../models/action.model";
import { ScheduleDataActionCreator } from "./schedule-data/schedule-data.action-creator";
import { cropScheduleDMToMonthDM } from "../../../common-models/schedule-data.model";

enum RevisionReducerAction {
  CHANGE_REVISION = "CHANGE_REVISION",
}

export class RevisionReducerActionCreator {
  static changeRevision(newRevisionType: RevisionType): ThunkFunction<unknown> {
    return async (dispatch, getState): Promise<void> => {
      const actualSchedule = getState().actualState.persistentSchedule.present;
      const actualMonthDM = cropScheduleDMToMonthDM(actualSchedule);

      const setRevisionAction = ScheduleDataActionCreator.setScheduleFromKeyIfExistsInDB(
        actualMonthDM.scheduleKey,
        actualMonthDM
      );

      dispatch(setRevisionAction);
      dispatch({
        type: RevisionReducerAction.CHANGE_REVISION,
        payload: newRevisionType,
      });
    };
  }
}

export function revisionInfoReducer(
  state: RevisionType = "primary",
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
