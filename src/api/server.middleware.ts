/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import * as _ from "lodash";
import { v4 as uuidv4 } from "uuid";
import { ScheduleDataModel } from "../common-models/schedule-data.model";
import {
  AlgorithmErrorCode,
  ScheduleError,
  WorkerOvertime,
  WorkerUnderTime,
} from "../common-models/schedule-error.model";
import { WorkerHourInfo } from "../helpers/worker-hours-info.model";
import { PrimaryMonthRevisionDataModel } from "../state/models/application-state.model";

type NameUuidMapper = {
  [name: string]: string;
};

export interface AnonymizeScheduleReturn {
  anonynimizedSchedule: ScheduleDataModel;
  anonymizationMap: NameUuidMapper;
}

export class ServerMiddleware {
  public static escapeJuliaIndexes(error: ScheduleError): ScheduleError {
    const indexFields = ["day", "week"];
    indexFields.forEach((field) => {
      if (error[field]) {
        error = { ...error, [field]: error[field] - 1 };
      }
    });
    return error;
  }

  public static anonymizeSchedule(originalSchedule: ScheduleDataModel): AnonymizeScheduleReturn {
    /* eslint-disable @typescript-eslint/camelcase */
    const nameToUuid: NameUuidMapper = {};

    const schedule = _.cloneDeep(originalSchedule);

    Object.keys(schedule.shifts).map(
      (shiftName): void => (nameToUuid[shiftName] = uuidv4(shiftName))
    );

    Object.keys(schedule.shifts).forEach((shiftName) => {
      schedule.shifts[nameToUuid[shiftName]] = schedule.shifts[shiftName];
      delete schedule.shifts[shiftName];
    });

    Object.keys(schedule.employee_info.time).forEach((shiftName) => {
      schedule.employee_info.time[nameToUuid[shiftName]] = schedule.employee_info.time[shiftName];
      delete schedule.employee_info.time[shiftName];
    });

    Object.keys(schedule.employee_info.type).forEach((shiftName) => {
      schedule.employee_info.type[nameToUuid[shiftName]] = schedule.employee_info.type[shiftName];
      delete schedule.employee_info.type[shiftName];
    });

    return {
      anonynimizedSchedule: schedule,
      anonymizationMap: nameToUuid,
    };
  }

  public static mapIsWorkingTypeSnakeCase(schedule: ScheduleDataModel): ScheduleDataModel {
    const result = _.cloneDeep(schedule);
    /* eslint-disable @typescript-eslint/no-explicit-any */
    Object.keys(result.shift_types).forEach((shiftCode) => {
      result.shift_types![shiftCode] = {
        ...result.shift_types[shiftCode],
        is_working_shift: result.shift_types[shiftCode].isWorkingShift,
      } as any;
    });
    return result;
  }

  public static remapScheduleErrorUsernames(
    el: ScheduleError,
    anonimizationMap: NameUuidMapper
  ): ScheduleError {
    if (el["worker"] !== undefined) {
      Object.keys(anonimizationMap).forEach((workerName) => {
        if (anonimizationMap[workerName] === el["worker"]) el["worker"] = workerName;
      });
    }
    return el;
  }

  public static replaceOvertimeAndUndertimeErrors(
    actualSchedule: ScheduleDataModel,
    primaryMonthData: PrimaryMonthRevisionDataModel,
    scheduleErrors: ScheduleError[]
  ): ScheduleError[] {
    const calculateNormHoursDiff = (workerName: string): number =>
      WorkerHourInfo.fromSchedules(workerName, actualSchedule, primaryMonthData).overTime;

    const validBackendScheduleErros = scheduleErrors.filter(
      (err) =>
        err.kind !== AlgorithmErrorCode.WorkerOvertime &&
        err.kind !== AlgorithmErrorCode.WorkerUnderTime
    );
    const overtimeAndUndetimeErrors: (WorkerOvertime | WorkerUnderTime)[] = [];
    Object.keys(actualSchedule.shifts).forEach((workerName) => {
      const workHoursDiff = calculateNormHoursDiff(workerName);
      if (workHoursDiff !== 0) {
        overtimeAndUndetimeErrors.push({
          kind:
            workHoursDiff > 0
              ? AlgorithmErrorCode.WorkerOvertime
              : AlgorithmErrorCode.WorkerUnderTime,
          hours: Math.abs(workHoursDiff),
          worker: workerName,
        });
      }
    });
    return _.concat(validBackendScheduleErros, overtimeAndUndetimeErrors);
  }
}
