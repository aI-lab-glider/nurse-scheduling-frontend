/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */

/* eslint-disable @typescript-eslint/camelcase */

import { ShiftCode, ShiftInfoModel } from "../../common-models/shift-info.model";
import {
  ContractType,
  WorkerInfoModel,
  WorkersInfoModel,
  WorkerType,
} from "../../common-models/worker-info.model";
import { WorkerInfoExtendedInterface } from "../../components/namestable/worker-edit.component";
import { ScheduleKey, ThunkFunction } from "../../api/persistance-store.model";
import _ from "lodash";
import { ScheduleActionType } from "./month-state/schedule-data/schedule.actions";
import { LocalStorageProvider } from "../../api/local-storage-provider.model";
import { MonthDataModel, ScheduleDataModel } from "../../common-models/schedule-data.model";
import { getEmployeeWorkTime } from "./month-state/employee-info.reducer";
import { VerboseDateHelper } from "../../helpers/verbose-date.helper";

export interface WorkerActionPayload {
  updatedShifts: ShiftInfoModel;
  updatedEmployeeInfo: WorkersInfoModel;
}

export class WorkerActionCreator {
  static addNewWorker(worker: WorkerInfoExtendedInterface): ThunkFunction<WorkerActionPayload> {
    return async (dispatch, getState): Promise<void> => {
      const actualSchedule = getState().actualState.persistentSchedule.present;
      const { month_number: monthNumber, year } = actualSchedule.schedule_info;

      const updatedSchedule = WorkerActionCreator.addWorkerInfo(actualSchedule, worker);
      await WorkerActionCreator.updateStateAndDb(dispatch, updatedSchedule);
      await WorkerActionCreator.updateNextMonthInDB(monthNumber, year, worker);
    };
  }

  static deleteWorker(worker: WorkerInfoModel | undefined): ThunkFunction<unknown> {
    return async (dispatch, getState): Promise<void> => {
      if (!worker) return;

      const { name } = worker;
      const actualSchedule = _.cloneDeep(getState().actualState.persistentSchedule.present);
      const updatedSchedule = WorkerActionCreator.deleteWorkerFromScheduleDM(actualSchedule, name);
      await WorkerActionCreator.updateStateAndDb(dispatch, updatedSchedule);
    };
  }

  static modifyWorker(worker: WorkerInfoExtendedInterface): ThunkFunction<WorkerActionPayload> {
    return async (dispatch, getState): Promise<void> => {
      const { prevName } = worker;
      const actualSchedule = _.cloneDeep(getState().actualState.persistentSchedule.present);
      let updatedSchedule = WorkerActionCreator.deleteWorkerFromScheduleDM(
        actualSchedule,
        prevName
      );
      updatedSchedule = WorkerActionCreator.addWorkerInfo(updatedSchedule, worker);
      await WorkerActionCreator.updateStateAndDb(dispatch, updatedSchedule);
    };
  }

  private static async updateStateAndDb(dispatch, schedule: ScheduleDataModel): Promise<void> {
    const { month_number: monthNumber, year } = schedule.schedule_info;
    const action = {
      type: ScheduleActionType.UPDATE_WORKER_INFO,
      payload: {
        updatedShifts: schedule.shifts,
        updatedEmployeeInfo: schedule.employee_info,
      },
    };
    dispatch(action);

    if (VerboseDateHelper.isMonthInFuture(monthNumber, year)) {
      await new LocalStorageProvider().saveSchedule("primary", schedule);
    }
    await new LocalStorageProvider().saveSchedule("actual", schedule);
  }

  private static async updateNextMonthInDB(currentMonth, currentYear, worker): Promise<void> {
    const nextMonthDM = await new LocalStorageProvider().getMonthRevision(
      new ScheduleKey(currentMonth, currentYear).nextMonthKey.getRevisionKey("primary")
    );
    if (_.isNil(nextMonthDM)) return;
    const updatedNextMonth = WorkerActionCreator.addWorkerInfoToMonthDM(nextMonthDM, worker);
    updatedNextMonth.scheduleKey = new ScheduleKey(currentMonth, currentYear).nextMonthKey;
    await new LocalStorageProvider().saveBothMonthRevisionsIfNeeded("primary", updatedNextMonth);
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

    const today = new Date();
    const newWorkerShifts = new Array(schedule.month_info.dates.length).fill(ShiftCode.W);
    if (today.getMonth() === monthNumber && today.getFullYear() === year) {
      newWorkerShifts.splice(
        0,
        today.getDate() - 1,
        ...new Array(today.getDate() - 1).fill(ShiftCode.NZ)
      );
    }

    updatedSchedule.shifts = {
      ...updatedSchedule.shifts,
      [workerName]: newWorkerShifts,
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

  private static addWorkerInfoToMonthDM(
    schedule: MonthDataModel,
    worker: WorkerInfoExtendedInterface
  ): MonthDataModel {
    const updatedSchedule = _.cloneDeep(schedule);
    const { year, month: monthNumber } = schedule.scheduleKey;
    const { workerName, workerType, contractType } = worker;

    const today = new Date();
    const newWorkerShifts = new Array(schedule.month_info.dates.length).fill(ShiftCode.W);
    if (today.getMonth() === monthNumber && today.getFullYear() === year) {
      newWorkerShifts.splice(
        0,
        today.getDate() - 1,
        ...new Array(today.getDate() - 1).fill(ShiftCode.NZ)
      );
    }

    updatedSchedule.shifts = {
      ...updatedSchedule.shifts,
      [workerName]: newWorkerShifts,
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
