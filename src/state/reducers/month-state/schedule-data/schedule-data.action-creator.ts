/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import { ThunkFunction } from "../../../../api/persistance-store.model";
import { ScheduleDataModel } from "../../../../common-models/schedule-data.model";
import { PersistentScheduleActionType } from "./persistent-schedule.reducer";
import { TemporaryScheduleActionType } from "./temporary-schedule.reducer";
import { ActionModel } from "../../../models/action.model";

export type ScheduleActionModel = ActionModel<ScheduleDataModel>;
export class ScheduleDataActionCreator {
  static setPersistentSchedule(newSchedule: ScheduleDataModel): ThunkFunction<ScheduleDataModel> {
    return async (dispatch): Promise<void> => {
      const setEditableSchedule = {
        type: TemporaryScheduleActionType.ADD_NEW,
        payload: newSchedule,
      };
      const setActualRevision = {
        type: PersistentScheduleActionType.SET_REVISION,
        payload: newSchedule,
      };
      dispatch(setActualRevision);
      dispatch(setEditableSchedule);
    };
  }

  static setTemporarySchedule(newSchedule: ScheduleDataModel): ScheduleActionModel {
    return {
      type: TemporaryScheduleActionType.ADD_NEW,
      payload: newSchedule,
    };
  }

  static updateSchedule(newScheduleModel: ScheduleDataModel): ScheduleActionModel {
    return {
      type: TemporaryScheduleActionType.UPDATE,
      payload: newScheduleModel,
    };
  }
}
