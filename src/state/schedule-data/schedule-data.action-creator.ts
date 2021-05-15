/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */

import _ from "lodash";
import { LocalStorageProvider } from "../../logic/data-access/local-storage-provider.model";
import {
  RevisionType,
  ScheduleKey,
  ThunkFunction,
} from "../../logic/data-access/persistance-store.model";

import { ActionModel } from "../../utils/action.model";
import { PERSISTENT_SCHEDULE_NAME, TEMPORARY_SCHEDULE_NAME } from "../app.reducer";
import {
  AddMonthRevisionAction,
  PrimaryRevisionAction,
} from "./primary-revision/primary-revision.reducer";
import { MonthDataModel, ScheduleDataModel } from "./schedule-data.model";
import { PrimaryMonthRevisionDataModel } from "../application-state.model";
import {
  extendMonthDMRevisionToScheduleDM,
  cropScheduleDMToMonthDM,
} from "../../logic/schedule-container-converter/schedule-container-converter";
import { ScheduleErrorMessageModel } from "./schedule-errors/schedule-error-message.model";
import { createActionName, ScheduleActionModel, ScheduleActionType } from "./schedule.actions";
import { Shift } from "./shifts-types/shift-types.model";
import { cleanScheduleErrors } from "./schedule-errors/schedule-errors.reducer";
import { LocalMonthRevisionManager } from "../../logic/data-access/month-revision-manager";
import { LocalSchedulePersistProvider } from "../../logic/data-access/schedule-persistance-provider";

export class ScheduleDataActionCreator {
  // #region Update state
  private static setCurrentAndPrimaryScheduleState(
    currentSchedule: ScheduleDataModel,
    baseSchedule: PrimaryMonthRevisionDataModel
  ): ThunkFunction<ScheduleDataModel | MonthDataModel> {
    return async (dispatch): Promise<void> => {
      const destinations = [PERSISTENT_SCHEDULE_NAME, TEMPORARY_SCHEDULE_NAME];
      destinations.forEach((destination) => {
        const addNewSchedule = {
          type: createActionName(destination, ScheduleActionType.ADD_NEW),
          payload: currentSchedule,
        };
        dispatch(addNewSchedule);
      });

      const addPrimaryRevision = {
        type: PrimaryRevisionAction.ADD_MONTH_PRIMARY_REVISION,
        payload: baseSchedule,
      } as AddMonthRevisionAction;
      dispatch(addPrimaryRevision);
    };
  }

  private static setScheduleFromMonthDM(
    monthDataModel: MonthDataModel,
    revision?: RevisionType
  ): ThunkFunction<ScheduleDataModel> {
    return async (dispatch, getState): Promise<void> => {
      if (_.isNil(revision)) {
        revision = getState().actualState.revision;
      }
      const newSchedule = await extendMonthDMRevisionToScheduleDM(monthDataModel, revision);
      const primaryMonthDM = await this.getMonthPrimaryRevisionDM(monthDataModel);

      dispatch(this.setCurrentAndPrimaryScheduleState(newSchedule, primaryMonthDM));
    };
  }

  static setScheduleStateAndCreateIfNeeded(
    monthKey: ScheduleKey,
    baseMonthModel: MonthDataModel,
    revision: RevisionType
  ): ThunkFunction<ScheduleDataModel> {
    return async (dispatch): Promise<void> => {
      const monthDataModel = await new LocalMonthRevisionManager().fetchOrCreateMonthRevision(
        monthKey,
        revision,
        baseMonthModel
      );
      dispatch(this.setScheduleFromMonthDM(monthDataModel));
    };
  }

  static setScheduleIfExistsInDb(
    monthKey: ScheduleKey,
    revision?: RevisionType
  ): ThunkFunction<ScheduleDataModel> {
    return async (dispatch, getState): Promise<void> => {
      if (_.isNil(revision)) {
        revision = getState().actualState.revision;
      }

      const monthDataModel = await new LocalStorageProvider().getMonthRevision(
        monthKey.getRevisionKey(revision)
      );

      if (!_.isNil(monthDataModel)) {
        dispatch(this.setScheduleFromMonthDM(monthDataModel));
      }
    };
  }
  // #endregion

  // #region Update state and save to DB
  static setScheduleStateAndSaveToDb(
    newSchedule: ScheduleDataModel,
    revision?: RevisionType
  ): ThunkFunction<ScheduleDataModel | MonthDataModel> {
    return async (dispatch, getState): Promise<void> => {
      if (_.isNil(revision)) {
        revision = getState().actualState.revision;
      }
      await new LocalSchedulePersistProvider().saveSchedule(revision, newSchedule);
      const primaryMonthDM = await this.getMonthPrimaryRevisionDM(
        cropScheduleDMToMonthDM(newSchedule)
      );
      dispatch(this.setCurrentAndPrimaryScheduleState(newSchedule, primaryMonthDM));
    };
  }

  static setScheduleFromMonthDMAndSaveInDB(
    newMonth: MonthDataModel,
    revision?: RevisionType
  ): ThunkFunction<ScheduleDataModel> {
    return async (dispatch, getState): Promise<void> => {
      if (_.isNil(revision)) {
        revision = getState().actualState.revision;
      }
      const newSchedule = await extendMonthDMRevisionToScheduleDM(newMonth, revision);
      dispatch(this.setScheduleStateAndSaveToDb(newSchedule, revision));
    };
  }

  // #endregion

  private static async getMonthPrimaryRevisionDM(
    monthDataModel: MonthDataModel
  ): Promise<PrimaryMonthRevisionDataModel> {
    const primaryMonthDM = await new LocalStorageProvider().getMonthRevision(
      monthDataModel.scheduleKey.getRevisionKey("primary")
    );
    return (primaryMonthDM ?? monthDataModel) as PrimaryMonthRevisionDataModel;
  }

  static updateSchedule(newScheduleModel: ScheduleDataModel): ScheduleActionModel {
    // TODO: make separate action creator for Tmp
    return {
      type: createActionName(TEMPORARY_SCHEDULE_NAME, ScheduleActionType.UPDATE),
      payload: newScheduleModel,
    };
  }

  static addNewShift(shift: Shift): (dispatch) => Promise<void> {
    return async (dispatch): Promise<void> => {
      const action = {
        type: ScheduleActionType.ADD_NEW_SHIFT,
        payload: { ...shift },
      };
      dispatch(action);
    };
  }

  static modifyShift(shift: Shift, oldShift: Shift): (dispatch) => Promise<void> {
    return async (dispatch): Promise<void> => {
      const action = {
        type: ScheduleActionType.MODIFY_SHIFT,
        payload: Array<Shift>(shift, oldShift),
      };
      dispatch(action);
    };
  }

  static deleteShift(shift: Shift): (dispatch) => Promise<void> {
    return async (dispatch): Promise<void> => {
      const action = {
        type: ScheduleActionType.DELETE_SHIFT,
        payload: shift,
      };
      dispatch(action);
    };
  }

  static hideErrors(): ActionModel<unknown> {
    return this.showError(undefined);
  }

  static showError(error: ScheduleErrorMessageModel | undefined): ActionModel<unknown> {
    return {
      type: ScheduleActionType.SHOW_ERROR,
      payload: error,
    };
  }

  static cleanErrors = cleanScheduleErrors;
}
