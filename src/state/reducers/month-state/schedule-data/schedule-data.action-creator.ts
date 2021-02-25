/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */

/* eslint-disable @typescript-eslint/camelcase */
import {
  extendMonthDMToScheduleDM,
  MonthDataModel,
  ScheduleDataModel,
} from "../../../../common-models/schedule-data.model";
import { RevisionType, ScheduleKey, ThunkFunction } from "../../../../api/persistance-store.model";
import { PERSISTENT_SCHEDULE_NAME, TEMPORARY_SCHEDULE_NAME } from "../../../app.reducer";
import { createActionName, ScheduleActionModel, ScheduleActionType } from "./schedule.actions";
import { WorkerInfoExtendedInterface } from "../../../../components/namestable/worker-edit.component";
import { LocalStorageProvider } from "../../../../api/local-storage-provider.model";
import _ from "lodash";
import {
  ContractType,
  WorkerInfoModel,
  WorkersInfoModel,
  WorkerType,
} from "../../../../common-models/worker-info.model";
import { ActionModel } from "../../../models/action.model";
import { getEmployeeWorkTime } from "../employee-info.reducer";
import { ShiftCode, ShiftInfoModel } from "../../../../common-models/shift-info.model";

export interface WorkerActionPayload {
  updatedShifts: ShiftInfoModel;
  updatedEmployeeInfo: WorkersInfoModel;
}

export class ScheduleDataActionCreator {
  static setScheduleFromScheduleDM(
    newSchedule: ScheduleDataModel,
    saveInDatabase = true
  ): ThunkFunction<ScheduleDataModel> {
    return async (dispatch, getState): Promise<void> => {
      const destinations = [PERSISTENT_SCHEDULE_NAME, TEMPORARY_SCHEDULE_NAME];
      if (saveInDatabase) {
        const { revision } = getState().actualState;
        await new LocalStorageProvider().saveSchedule(revision, newSchedule);
      }
      destinations.forEach((destination) => {
        const action = {
          type: createActionName(destination, ScheduleActionType.ADD_NEW),
          payload: newSchedule,
        };
        dispatch(action);
      });
    };
  }

  static setScheduleFromMonthDM(
    newMonth: MonthDataModel,
    saveInDatabase = true,
    revision?: RevisionType
  ): ThunkFunction<ScheduleDataModel> {
    return async (dispatch, getState): Promise<void> => {
      if (_.isNil(revision)) {
        revision = getState().actualState.revision;
      }
      const [prevMonth, nextMonth] = await new LocalStorageProvider().fetchOrCreateMonthNeighbours(
        newMonth,
        revision
      );
      const newSchedule = extendMonthDMToScheduleDM(prevMonth, newMonth, nextMonth);
      await this.setScheduleFromScheduleDM(newSchedule, saveInDatabase)(dispatch, getState);
    };
  }

  static setScheduleFromKeyIfExistsInDB(
    monthKey: ScheduleKey,
    revision?: RevisionType,
    baseMonthModel?: MonthDataModel
  ): ThunkFunction<ScheduleDataModel> {
    return async (dispatch, getState): Promise<void> => {
      let monthDataModel;
      if (_.isNil(revision)) {
        revision = getState().actualState.revision;
      }

      if (baseMonthModel) {
        monthDataModel = await new LocalStorageProvider().fetchOrCreateMonthRevision(
          monthKey,
          revision,
          baseMonthModel
        );
      } else {
        monthDataModel = await new LocalStorageProvider().getMonthRevision(
          monthKey.getRevisionKey(revision)
        );
      }

      if (!_.isNil(monthDataModel)) {
        dispatch(this.setScheduleFromMonthDM(monthDataModel, false, revision));
      }
    };
  }

  static updateSchedule(newScheduleModel: ScheduleDataModel): ScheduleActionModel {
    return {
      type: createActionName(TEMPORARY_SCHEDULE_NAME, ScheduleActionType.UPDATE),
      payload: newScheduleModel,
    };
  }

  static addNewWorker(worker: WorkerInfoExtendedInterface): ThunkFunction<WorkerActionPayload> {
    return async (dispatch, getState): Promise<void> => {
      const actualSchedule = getState().actualState.persistentSchedule.present;

      const updatedSchedule = ScheduleDataActionCreator.addWorkerInfo(actualSchedule, worker);
      await ScheduleDataActionCreator.updateStateAndDb(dispatch, updatedSchedule);
    };
  }

  static deleteWorker(worker: WorkerInfoModel | undefined): ThunkFunction<unknown> {
    return async (dispatch, getState): Promise<void> => {
      if (!worker) return;

      const { name } = worker;
      const actualSchedule = _.cloneDeep(getState().actualState.persistentSchedule.present);
      const updatedSchedule = ScheduleDataActionCreator.deleteWorkerFromScheduleDM(
        actualSchedule,
        name
      );
      await ScheduleDataActionCreator.updateStateAndDb(dispatch, updatedSchedule);
    };
  }

  static modifyWorker(worker: WorkerInfoExtendedInterface): ThunkFunction<WorkerActionPayload> {
    return async (dispatch, getState): Promise<void> => {
      const { prevName } = worker;
      debugger;
      const actualSchedule = _.cloneDeep(getState().actualState.persistentSchedule.present);
      let updatedSchedule = ScheduleDataActionCreator.deleteWorkerFromScheduleDM(
        actualSchedule,
        prevName
      );
      updatedSchedule = ScheduleDataActionCreator.addWorkerInfo(updatedSchedule, worker);
      await ScheduleDataActionCreator.updateStateAndDb(dispatch, updatedSchedule);
    };
  }

  static cleanErrors(): ActionModel<unknown> {
    const action = {
      type: ScheduleActionType.CLEAN_ERRORS,
    };
    return action;
  }

  private static async updateStateAndDb(dispatch, schedule) {
    const action = {
      type: ScheduleActionType.UPDATE_WORKER_INFO,
      payload: {
        updatedShifts: schedule.shifts,
        updatedEmployeeInfo: schedule.employee_info,
      },
    };
    dispatch(action);

    await new LocalStorageProvider().saveSchedule("actual", schedule);
  }

  private static deleteWorkerFromScheduleDM(
    schedule: ScheduleDataModel,
    workerName
  ): ScheduleDataModel {
    const scheduleCopy = _.cloneDeep(schedule);
    delete scheduleCopy.employee_info.time[workerName];
    delete scheduleCopy.employee_info.type[workerName];
    delete scheduleCopy.employee_info.contractType?.[workerName];
    delete scheduleCopy.shifts[workerName];

    return scheduleCopy;
  }

  private static addWorkerInfo(
    schedule: ScheduleDataModel,
    worker: WorkerInfoExtendedInterface
  ): ScheduleDataModel {
    const updatedSchedule = _.cloneDeep(schedule);
    const { year, month_number: monthNumber } = schedule.schedule_info;
    const { workerName, workerType, contractType } = worker;

    updatedSchedule.shifts = {
      ...updatedSchedule.shifts,
      [workerName]: new Array(schedule.month_info.dates.length).fill(ShiftCode.W),
    };

    updatedSchedule.employee_info = {
      time: {
        [workerName]: getEmployeeWorkTime({ ...worker, monthNumber, year }),
        ...updatedSchedule.employee_info.time,
      },
      type: { [workerName]: workerType ?? WorkerType.NURSE, ...updatedSchedule.employee_info.type },
      contractType: {
        [workerName]: contractType ?? ContractType.EMPLOYMENT_CONTRACT,
        ...updatedSchedule.employee_info.contractType,
      },
    };

    return updatedSchedule;
  }
}
