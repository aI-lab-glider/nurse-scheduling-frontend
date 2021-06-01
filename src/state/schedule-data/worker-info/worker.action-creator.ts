/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */

import * as _ from "lodash";
import { WorkerInfoExtendedInterface } from "../../../components/drawers/worker-drawer/worker-edit";
import { MonthDataArray } from "../../../helpers/month-data-array.model";
import { MonthModelHelper } from "../../../helpers/month-model.helper";
import { VerboseDateHelper } from "../../../helpers/verbose-date.helper";
import {
  getMonthRevision,
  saveMonthRevision
} from "../../../logic/data-access/month-revision-manager";
import {
  PersistStorageManager,
  RevisionType,
  ScheduleKey,
  ThunkFunction
} from "../../../logic/data-access/persistance-store.model";
import { cropScheduleDMToMonthDM } from "../../../logic/schedule-container-converter/schedule-container-converter";
import {
  DEFAULT_CONTRACT_TYPE,
  DEFAULT_TEAM,
  DEFAULT_WORKER_TYPE
} from "../../../logic/schedule-parser/workers-info.parser";
import { ScheduleDataActionCreator } from "../schedule-data.action-creator";
import { MonthDataModel, ScheduleDataModel } from "../schedule-data.model";
import { ShiftCode } from "../shifts-types/shift-types.model";
import { WorkerShiftsModel } from "../workers-shifts/worker-shifts.model";
import { WorkerInfoModel, WorkersInfoModel } from "./worker-info.model";

export interface WorkerActionPayload {
  updatedShifts: WorkerShiftsModel;
  updatedEmployeeInfo: WorkersInfoModel;
}

export class WorkerActionCreator {
  static addNewWorker(worker: WorkerInfoExtendedInterface): ThunkFunction<WorkerActionPayload> {
    return async (dispatch, getState): Promise<void> => {
      const actualSchedule = getState().actualState.persistentSchedule.present;
      const actualMonth = cropScheduleDMToMonthDM(actualSchedule);
      const newWorkerShifts = this.createNewWorkerShifts(actualMonth.scheduleKey);

      const updatedMonth = WorkerActionCreator.addWorkerInfoToMonthDM(
        actualMonth,
        worker,
        newWorkerShifts
      );

      dispatch(this.createUpdateAction(updatedMonth));

      const nextMonthDM = await getMonthRevision(
        actualMonth.scheduleKey.nextMonthKey.getRevisionKey("primary"),
        PersistStorageManager.getInstance().actualPersistProvider
      );
      if (_.isNil(nextMonthDM) || !nextMonthDM.isAutoGenerated) return;
      const nextMonthNewWorkerShifts = this.createNewWorkerShifts(nextMonthDM.scheduleKey);
      const updatedNextMonth = WorkerActionCreator.addWorkerInfoToMonthDM(
        nextMonthDM,
        worker,
        nextMonthNewWorkerShifts
      );
      await saveMonthRevision(
        "primary",
        updatedNextMonth,
        PersistStorageManager.getInstance().actualPersistProvider
      );
    };
  }

  static deleteWorker(worker: WorkerInfoModel | undefined): ThunkFunction<unknown> {
    return async (dispatch, getState): Promise<void> => {
      if (!worker) return;

      const { name } = worker;
      const actualSchedule = _.cloneDeep(getState().actualState.persistentSchedule.present);
      const actualMonth = cropScheduleDMToMonthDM(actualSchedule);

      const updatedMonth = WorkerActionCreator.deleteWorkerFromMonthDM(actualMonth, name);

      dispatch(this.createUpdateAction(updatedMonth));

      const nextMonthDM = await getMonthRevision(
        actualMonth.scheduleKey.nextMonthKey.getRevisionKey("primary"),
        PersistStorageManager.getInstance().actualPersistProvider
      );

      if (_.isNil(nextMonthDM) || !nextMonthDM.isAutoGenerated) return;
      const updatedNextMonth = WorkerActionCreator.deleteWorkerFromMonthDM(actualMonth, name);
      await saveMonthRevision(
        "primary",
        updatedNextMonth,
        PersistStorageManager.getInstance().actualPersistProvider
      );
    };
  }

  static modifyWorker(worker: WorkerInfoExtendedInterface): ThunkFunction<WorkerActionPayload> {
    return async (dispatch, getState): Promise<void> => {
      const { prevName } = worker;
      const actualSchedule = _.cloneDeep(getState().actualState.persistentSchedule.present);
      const actualMonth = cropScheduleDMToMonthDM(actualSchedule);

      let updatedMonth = WorkerActionCreator.addWorkerInfoToMonthDM(
        actualMonth,
        worker,
        actualMonth.shifts[prevName]
      );

      if (prevName !== worker.workerName) {
        updatedMonth = WorkerActionCreator.deleteWorkerFromMonthDM(updatedMonth, prevName);
      }
      dispatch(this.createUpdateAction(updatedMonth));

      const nextMonthDM = await getMonthRevision(
        actualMonth.scheduleKey.nextMonthKey.getRevisionKey("primary"),
        PersistStorageManager.getInstance().actualPersistProvider
      );
      if (_.isNil(nextMonthDM) || !nextMonthDM.isAutoGenerated) return;
      if (_.isNil(nextMonthDM.shifts[prevName])) {
        throw Error(
          `Next month (${nextMonthDM.scheduleKey}) auto generated instance should have the same ` +
            `workers as current month, but it not include ${prevName}`
        );
      }
      let updatedNextMonth = WorkerActionCreator.addWorkerInfoToMonthDM(
        nextMonthDM,
        worker,
        nextMonthDM.shifts[prevName]
      );
      if (prevName !== worker.workerName) {
        updatedNextMonth = WorkerActionCreator.deleteWorkerFromMonthDM(updatedNextMonth, prevName);
      }
      await saveMonthRevision(
        "primary",
        updatedNextMonth,
        PersistStorageManager.getInstance().actualPersistProvider
      );
    };
  }

  private static createUpdateAction(
    updatedMonth: MonthDataModel
  ): ThunkFunction<ScheduleDataModel> {
    const { year, month } = updatedMonth.scheduleKey;
    const revision: RevisionType = VerboseDateHelper.isMonthInFuture(month, year)
      ? "primary"
      : "actual";

    return ScheduleDataActionCreator.setScheduleFromMonthDMAndSaveInDB(updatedMonth, revision);
  }

  private static deleteWorkerFromMonthDM(
    monthDataModel: MonthDataModel,
    workerName: string
  ): MonthDataModel {
    const monthDataModelCopy = _.cloneDeep(monthDataModel);
    delete monthDataModelCopy.employee_info.time[workerName];
    delete monthDataModelCopy.employee_info.type[workerName];
    if (monthDataModelCopy.employee_info.contractType) {
      delete monthDataModelCopy.employee_info.contractType?.[workerName]; // nosonar
    }
    delete monthDataModelCopy.shifts[workerName];

    return monthDataModelCopy;
  }

  private static addWorkerInfoToMonthDM(
    monthDataModel: MonthDataModel,
    worker: WorkerInfoExtendedInterface,
    newWorkerShifts: MonthDataArray<ShiftCode>
  ): MonthDataModel {
    const updatedSchedule = _.cloneDeep(monthDataModel);
    const { workerName, workerType, contractType, team } = worker;

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
      team: {
        ...updatedSchedule.employee_info.team,
        [workerName]: team ?? DEFAULT_TEAM,
      },
    };

    return updatedSchedule;
  }

  private static createNewWorkerShifts({ year, month }: ScheduleKey): MonthDataArray<ShiftCode> {
    const today = new Date();
    const newWorkerShifts = MonthModelHelper.createMonthArray(year, month, ShiftCode.W);
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
