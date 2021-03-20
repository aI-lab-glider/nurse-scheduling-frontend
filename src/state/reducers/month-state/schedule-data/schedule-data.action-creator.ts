/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */

/* eslint-disable @typescript-eslint/camelcase */
import { MonthDataModel, ScheduleDataModel } from "../../../../common-models/schedule-data.model";
import { RevisionType, ScheduleKey, ThunkFunction } from "../../../../api/persistance-store.model";
import { PERSISTENT_SCHEDULE_NAME, TEMPORARY_SCHEDULE_NAME } from "../../../app.reducer";
import { createActionName, ScheduleActionModel, ScheduleActionType } from "./schedule.actions";
import { LocalStorageProvider } from "../../../../api/local-storage-provider.model";
import _ from "lodash";
import { ActionModel } from "../../../models/action.model";
import { Shift } from "../../../../common-models/shift-info.model";
import { AddMonthRevisionAction, PrimaryRevisionAction } from "../../base-revision.reducer";
import { PrimaryMonthRevisionDataModel } from "../../../models/application-state.model";
import {
  cropScheduleDMToMonthDM,
  extendMonthDMRevisionToScheduleDM,
} from "../../../../logic/schedule-container-convertion/schedule-container-convertion";

export class ScheduleDataActionCreator {
  //#region Update state
  private static setCurrentAndPrimaryScheduleState(
    currentSchedule: ScheduleDataModel,
    baseSchedule: PrimaryMonthRevisionDataModel
  ): ThunkFunction<ScheduleDataModel | MonthDataModel> {
    return async (dispatch): Promise<void> => {
      const destinations = [PERSISTENT_SCHEDULE_NAME, TEMPORARY_SCHEDULE_NAME];
      debugger;
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
      const monthDataModel = await new LocalStorageProvider().fetchOrCreateMonthRevision(
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
  //#endregion

  //#region Update state and save to DB
  static setScheduleStateAndSaveToDb(
    newSchedule: ScheduleDataModel
  ): ThunkFunction<ScheduleDataModel | MonthDataModel> {
    return async (dispatch, getState): Promise<void> => {
      const { revision } = getState().actualState;
      await new LocalStorageProvider().saveSchedule(revision, newSchedule);
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
      dispatch(this.setScheduleStateAndSaveToDb(newSchedule));
    };
  }

  //#endregion

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

  static cleanErrors(): ActionModel<unknown> {
    const action = {
      type: ScheduleActionType.CLEAN_ERRORS,
    };
    return action;
  }
}
