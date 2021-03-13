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
import { ScheduleKey, ThunkFunction } from "../../api/persistance-store.model";
import _ from "lodash";
import { ScheduleActionType } from "./month-state/schedule-data/schedule.actions";
import { LocalStorageProvider } from "../../api/local-storage-provider.model";
import { MonthDataModel, ScheduleDataModel } from "../../common-models/schedule-data.model";
import { VerboseDateHelper } from "../../helpers/verbose-date.helper";
import { ThunkDispatch } from "redux-thunk";
import { ActionModel } from "../models/action.model";
import { ApplicationStateModel } from "../models/application-state.model";
import { WorkerInfoExtendedInterface } from "../../components/namestable/worker-edit";

export interface WorkerActionPayload {
  updatedShifts: ShiftInfoModel;
  updatedEmployeeInfo: WorkersInfoModel;
}

export class WorkerActionCreator {
  static addNewWorker(worker: WorkerInfoExtendedInterface): ThunkFunction<WorkerActionPayload> {
    return async (dispatch, getState): Promise<void> => {
      const actualSchedule = getState().actualState.persistentSchedule.present;
      const { month_number: monthNumber, year } = actualSchedule.schedule_info;

      const updatedSchedule = WorkerActionCreator.addWorkerInfo(
        actualSchedule,
        worker,
        this.createNewWorkerShifts
      );
      await WorkerActionCreator.updateStateAndDb(dispatch, updatedSchedule);
      await WorkerActionCreator.updateNextMonthInDB(
        monthNumber,
        year,
        worker,
        this.createNewWorkerShifts
      );
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
      const getUpdatedWorkerShifts = (schedule: ScheduleDataModel | MonthDataModel): ShiftCode[] =>
        schedule.shifts[prevName];
      let updatedSchedule = WorkerActionCreator.addWorkerInfo(
        actualSchedule,
        worker,
        getUpdatedWorkerShifts
      );

      if (prevName !== worker.workerName) {
        updatedSchedule = WorkerActionCreator.deleteWorkerFromScheduleDM(updatedSchedule, prevName);
      }
      await WorkerActionCreator.updateStateAndDb(dispatch, updatedSchedule);
      const { month_number: monthNumber, year } = updatedSchedule.schedule_info;
      await WorkerActionCreator.updateNextMonthInDB(
        monthNumber,
        year,
        worker,
        getUpdatedWorkerShifts
      );
    };
  }

  private static async updateStateAndDb(
    dispatch: ThunkDispatch<ApplicationStateModel, void, ActionModel<WorkerActionPayload, string>>,
    schedule: ScheduleDataModel
  ): Promise<void> {
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

  private static async updateNextMonthInDB(
    currentMonth: number,
    currentYear: number,
    worker: WorkerInfoExtendedInterface,
    createWorkerShifts: (schedule: MonthDataModel, year: number, monthNumber: number) => ShiftCode[]
  ): Promise<void> {
    const nextMonthDM = await new LocalStorageProvider().getMonthRevision(
      new ScheduleKey(currentMonth, currentYear).nextMonthKey.getRevisionKey("primary")
    );
    if (_.isNil(nextMonthDM)) return;
    const updatedNextMonth = WorkerActionCreator.addWorkerInfoToMonthDM(
      nextMonthDM,
      worker,
      createWorkerShifts
    );
    updatedNextMonth.scheduleKey = new ScheduleKey(currentMonth, currentYear).nextMonthKey;
    await new LocalStorageProvider().saveBothMonthRevisionsIfNeeded("primary", updatedNextMonth);
  }

  private static deleteWorkerFromScheduleDM(
    schedule: ScheduleDataModel,
    workerName: string
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
    worker: WorkerInfoExtendedInterface,
    createWorkerShifts: (
      schedule: ScheduleDataModel,
      year: number,
      monthNumber: number
    ) => ShiftCode[]
  ): ScheduleDataModel {
    const { year, month_number: monthNumber } = schedule.schedule_info;
    return this.addWorkerInfoToSchedule(schedule, worker, year, monthNumber, createWorkerShifts);
  }

  private static addWorkerInfoToMonthDM(
    schedule: MonthDataModel,
    worker: WorkerInfoExtendedInterface,
    createWorkerShifts: (schedule: MonthDataModel, year: number, monthNumber: number) => ShiftCode[]
  ): MonthDataModel {
    const { year, month: monthNumber } = schedule.scheduleKey;
    return this.addWorkerInfoToSchedule(schedule, worker, year, monthNumber, createWorkerShifts);
  }

  private static addWorkerInfoToSchedule<T extends MonthDataModel | ScheduleDataModel>(
    schedule: T,
    worker: WorkerInfoExtendedInterface,
    year: number,
    monthNumber: number,
    createWorkerShifts: (schedule: T, year: number, monthNumber: number) => ShiftCode[]
  ): T {
    const updatedSchedule = _.cloneDeep(schedule);
    const { workerName, workerType, contractType } = worker;
    const newWorkerShifts = createWorkerShifts(schedule, year, monthNumber);

    updatedSchedule.shifts = {
      ...updatedSchedule.shifts,
      [workerName]: newWorkerShifts,
    };

    updatedSchedule.employee_info = {
      time: {
        ...updatedSchedule.employee_info.time,
        [workerName]: worker.time,
      },
      type: {
        ...updatedSchedule.employee_info.type,
        [workerName]: workerType ?? WorkerType.NURSE,
      },
      contractType: {
        ...updatedSchedule.employee_info.contractType,
        [workerName]: contractType ?? ContractType.EMPLOYMENT_CONTRACT,
      },
    };

    return updatedSchedule;
  }

  private static createNewWorkerShifts(
    schedule: ScheduleDataModel | MonthDataModel,
    year: number,
    monthNumber: number
  ): ShiftCode[] {
    const today = new Date();
    const newWorkerShifts = new Array(schedule.month_info.dates.length).fill(ShiftCode.W);
    if (today.getMonth() === monthNumber && today.getFullYear() === year) {
      newWorkerShifts.splice(
        0,
        today.getDate() - 1,
        ...new Array(today.getDate() - 1).fill(ShiftCode.NZ)
      );
    }
    return newWorkerShifts;
  }
}
