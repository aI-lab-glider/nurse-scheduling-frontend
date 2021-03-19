/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */

/* eslint-disable @typescript-eslint/camelcase */

import { ShiftCode, ShiftInfoModel } from "../../common-models/shift-info.model";
import { ContractType, WorkerInfoModel, WorkersInfoModel, WorkerType } from "../../common-models/worker-info.model";
import { RevisionType, ThunkFunction } from "../../api/persistance-store.model";
import _ from "lodash";
<<<<<<< HEAD
import { MonthDataModel } from "../../common-models/schedule-data.model";
=======
import { MonthDataModel, ScheduleDataModel } from "../../common-models/schedule-data.model";
import { getEmployeeWorkTime } from "./month-state/employee-info.reducer";
>>>>>>> Refactor update action
import { cropScheduleDMToMonthDM } from "../../logic/schedule-container-convertion/schedule-container-convertion";
import { MonthHelper } from "../../helpers/month.helper";
import { ScheduleDataActionCreator } from "./month-state/schedule-data/schedule-data.action-creator";
import { VerboseDateHelper } from "../../helpers/verbose-date.helper";
import { WorkerInfoExtendedInterface } from "../../components/namestable/worker-edit";

export interface WorkerActionPayload {
  updatedShifts: ShiftInfoModel;
  updatedEmployeeInfo: WorkersInfoModel;
}

export class WorkerActionCreator {
  static addNewWorker(worker: WorkerInfoExtendedInterface): ThunkFunction<WorkerActionPayload> {
    return async (dispatch, getState): Promise<void> => {
      const actualSchedule = getState().actualState.persistentSchedule.present;
      const actualMonth = cropScheduleDMToMonthDM(actualSchedule);

      const updatedMonth = WorkerActionCreator.addWorkerInfoToMonthDM(
        actualMonth,
        worker,
        this.createNewWorkerShifts
      );
      dispatch(this.createUpdateAction(updatedMonth));
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
    };
  }

  static modifyWorker(worker: WorkerInfoExtendedInterface): ThunkFunction<WorkerActionPayload> {
    return async (dispatch, getState): Promise<void> => {
      const { prevName } = worker;
      const actualSchedule = _.cloneDeep(getState().actualState.persistentSchedule.present);
      const actualMonth = cropScheduleDMToMonthDM(actualSchedule);
      const getUpdatedWorkerShifts = (monthDataModel: MonthDataModel): ShiftCode[] =>
        monthDataModel.shifts[prevName];
      let updatedMonth = WorkerActionCreator.addWorkerInfoToMonthDM(
        actualMonth,
        worker,
        getUpdatedWorkerShifts
      );

      if (prevName !== worker.workerName) {
        updatedMonth = WorkerActionCreator.deleteWorkerFromMonthDM(updatedMonth, prevName);
      }

      dispatch(this.createUpdateAction(updatedMonth));
    };
  }

  private static createUpdateAction(
    updatedMonth: MonthDataModel
  ): ThunkFunction<ScheduleDataModel> {
    const { year, month } = updatedMonth.scheduleKey;
    const revision: RevisionType = VerboseDateHelper.isCurrentOrFutureMonth(month, year)
      ? "actual"
      : "primary";
    return ScheduleDataActionCreator.setScheduleFromMonthDMAndSaveInDB(updatedMonth, revision);
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

  private static addWorkerInfoToMonthDM(
    monthDataModel: MonthDataModel,
    worker: WorkerInfoExtendedInterface,
    createWorkerShifts: (schedule: MonthDataModel) => ShiftCode[]
  ): MonthDataModel {
    const updatedSchedule = _.cloneDeep(monthDataModel);
    const { workerName, workerType, contractType } = worker;
    const newWorkerShifts = createWorkerShifts(monthDataModel);
    const { year, month } = monthDataModel.scheduleKey;

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

  private static createNewWorkerShifts(monthDataModel: MonthDataModel): ShiftCode[] {
    const today = new Date();
    const { year, month } = monthDataModel.scheduleKey;
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
