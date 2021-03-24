/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */

/* eslint-disable @typescript-eslint/camelcase */

import * as _ from "lodash";
import { MonthUpdater, ScheduleKey, ThunkFunction } from "../../api/persistance-store.model";
import { MonthDataModel } from "../../common-models/schedule-data.model";
import { ShiftCode, ShiftInfoModel } from "../../common-models/shift-info.model";
import { WorkerInfoModel, WorkersInfoModel } from "../../common-models/worker-info.model";
import { WorkerInfoExtendedInterface } from "../../components/namestable/worker-edit";
import { MonthHelper } from "../../helpers/month.helper";
import {
  DEFAULT_CONTRACT_TYPE,
  DEFAULT_WORKER_GROUP,
  DEFAULT_WORKER_TYPE,
} from "../../logic/schedule-parser/workers-info.parser";
import { ScheduleDataActionCreator } from "./month-state/schedule-data/schedule-data.action-creator";
import { updateStateAndDB } from "../../logic/month-update/month-update.logic";

export interface WorkerActionPayload {
  updatedShifts: ShiftInfoModel;
  updatedEmployeeInfo: WorkersInfoModel;
}

export class WorkerActionCreator {
  static replaceWorkerShiftsInTmpSchedule(newWorkerShifts: ShiftInfoModel): ThunkFunction<unknown> {
    newWorkerShifts = _.cloneDeep(newWorkerShifts);
    return async (dispatch, getState): Promise<void> => {
      const temporarySchedule = _.cloneDeep(getState().actualState.temporarySchedule.present);
      temporarySchedule.shifts = { ...temporarySchedule.shifts, ...newWorkerShifts };
      const action = ScheduleDataActionCreator.updateSchedule(temporarySchedule);
      dispatch(action);
    };
  }

  static addNewWorker(worker: WorkerInfoExtendedInterface): ThunkFunction<WorkerActionPayload> {
    return async (dispatch, getState): Promise<void> => {
      const updateFunc: MonthUpdater = (month: MonthDataModel) =>
        this.addNewWorkerToMonth(month, worker);
      await updateStateAndDB(dispatch, getState, updateFunc);
    };
  }

  static deleteWorker(worker: WorkerInfoModel | undefined): ThunkFunction<unknown> {
    return async (dispatch, getState): Promise<void> => {
      if (!worker) return;
      const updateFunc: MonthUpdater = (month: MonthDataModel) =>
        this.deleteWorkerFromMonthDM(month, worker.name);
      await updateStateAndDB(dispatch, getState, updateFunc);
    };
  }

  static modifyWorker(worker: WorkerInfoExtendedInterface): ThunkFunction<WorkerActionPayload> {
    return async (dispatch, getState): Promise<void> => {
      const updateFunc: MonthUpdater = (month: MonthDataModel) =>
        this.modifyWorkerInMonthDM(month, worker);
      await updateStateAndDB(dispatch, getState, updateFunc);
    };
  }

  private static addNewWorkerToMonth(
    actualMonth: MonthDataModel,
    worker: WorkerInfoExtendedInterface
  ): MonthDataModel {
    const newWorkerShifts = this.createNewWorkerShifts(actualMonth.scheduleKey);
    return WorkerActionCreator.addWorkerInfoToMonthDM(actualMonth, worker, newWorkerShifts);
  }

  private static deleteWorkerFromMonthDM(
    monthDataModel: MonthDataModel,
    workerName: string
  ): MonthDataModel {
    const monthDataModelCopy = _.cloneDeep(monthDataModel);
    delete monthDataModelCopy.employee_info.time[workerName];
    delete monthDataModelCopy.employee_info.type[workerName];
    delete monthDataModelCopy.employee_info.contractType?.[workerName];
    delete monthDataModelCopy.shifts[workerName];

    return monthDataModelCopy;
  }

  private static modifyWorkerInMonthDM(
    actualMonth: MonthDataModel,
    worker: WorkerInfoExtendedInterface
  ): MonthDataModel {
    const { prevName } = worker;
    if (_.isNil(actualMonth!.shifts[prevName])) {
      throw Error(
        `Month (${actualMonth!.scheduleKey}) not include ${prevName} whom should be modified`
      );
    }

    let updatedMonth = WorkerActionCreator.addWorkerInfoToMonthDM(
      actualMonth,
      worker,
      actualMonth.shifts[prevName]
    );

    if (prevName !== worker.workerName) {
      updatedMonth = WorkerActionCreator.deleteWorkerFromMonthDM(updatedMonth, prevName);
    }
    return updatedMonth;
  }

  private static addWorkerInfoToMonthDM(
    monthDataModel: MonthDataModel,
    worker: WorkerInfoExtendedInterface,
    newWorkerShifts: ShiftCode[]
  ): MonthDataModel {
    const updatedSchedule = _.cloneDeep(monthDataModel);
    const { workerName, workerType, contractType, workerGroup } = worker;

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
        [workerName]: workerType ?? DEFAULT_WORKER_TYPE,
      },
      contractType: {
        ...updatedSchedule.employee_info.contractType,
        [workerName]: contractType ?? DEFAULT_CONTRACT_TYPE,
      },
      workerGroup: {
        ...updatedSchedule.employee_info.workerGroup,
        [workerName]: workerGroup ?? DEFAULT_WORKER_GROUP,
      },
    };

    return updatedSchedule;
  }

  private static createNewWorkerShifts({ year, month }: ScheduleKey): ShiftCode[] {
    const today = new Date();
    const newWorkerShifts = new Array(MonthHelper.getMonthLength(year, month)).fill(ShiftCode.W);
    if (today.getMonth() === month && today.getFullYear() === year) {
      newWorkerShifts.splice(
        0,
        today.getDate() - 1,
        ...new Array(today.getDate() - 1).fill(ShiftCode.NZ)
      );
    }
    return newWorkerShifts;
  }
}
