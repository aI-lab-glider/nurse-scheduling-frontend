/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import * as _ from "lodash";
import { v4 as uuidv4 } from "uuid";
import { ScheduleDataModel } from "../state/schedule-data/schedule-data.model";
import {
  AlgorithmErrorCode,
  ScheduleError,
  WorkerOvertime,
  WorkerTeamsCollision,
  WorkerUnderTime,
} from "../state/schedule-data/schedule-errors/schedule-error.model";
import { WorkerHourInfo } from "../helpers/worker-hours-info.model";
import { PrimaryMonthRevisionDataModel } from "../state/application-state.model";

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

    Object.keys(schedule.employee_info.team).forEach((shiftName) => {
      schedule.employee_info.team[nameToUuid[shiftName]] = schedule.employee_info.team[shiftName];
      delete schedule.employee_info.team[shiftName];
    });

    if (schedule.employee_info.contractType !== undefined) {
      Object.keys(schedule.employee_info.contractType).forEach((shiftName) => {
        schedule.employee_info.contractType![
          nameToUuid[shiftName]
        ] = schedule.employee_info.contractType![shiftName];
        delete schedule.employee_info.contractType![shiftName];
      });
    }

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

    if ("workers" in el) {
      el.workers = el.workers.map((worker) => {
        const workerName = Object.keys(anonimizationMap).find((workerName) => {
          return anonimizationMap[workerName] === worker;
        });
        return workerName !== undefined ? workerName : worker;
      });
    }

    return el;
  }

  public static aggregateWTCErrors(errors: ScheduleError[]): ScheduleError[] {
    const validBackendScheduleErros = errors.filter(
      (err) => err.kind !== AlgorithmErrorCode.WorkerTeamsCollision
    );
    const WTCErrors = errors.filter(
      (err) => err.kind === AlgorithmErrorCode.WorkerTeamsCollision
    ) as WorkerTeamsCollision[];

    const createWTCError = (item: WorkerTeamsCollision): WorkerTeamsCollision => ({
      kind: AlgorithmErrorCode.WorkerTeamsCollision,
      day: item.day,
      hour: -1,
      hours: [item.hour],
      workers: item.workers,
    });

    const aggregatedWTCErrors: WorkerTeamsCollision[] = [];
    WTCErrors.forEach((item, index) => {
      if (item.hour > -1) {
        const newWTCError = createWTCError(item);
        const sameDayErrors = WTCErrors.slice(index + 1).filter(
          (otherError) => item.day === otherError.day
        );
        sameDayErrors.forEach((otherError) => {
          newWTCError.hours!.push(otherError.hour);
          newWTCError.workers = _.uniq(_.concat(newWTCError.workers, otherError.workers));
          otherError.hour = -1;
        });

        aggregatedWTCErrors.push(newWTCError);
      }
    });

    return _.concat(validBackendScheduleErros, aggregatedWTCErrors);
  }

  public static replaceOvertimeAndUndertimeErrors(
    actualSchedule: ScheduleDataModel,
    primaryMonthData: PrimaryMonthRevisionDataModel,
    scheduleErrors: ScheduleError[]
  ): ScheduleError[] {
    const calculateOvertime = (workerName: string): number =>
      WorkerHourInfo.fromSchedules(workerName, actualSchedule, primaryMonthData).overTime;

    const validBackendScheduleErros = scheduleErrors.filter(
      (err) =>
        err.kind !== AlgorithmErrorCode.WorkerOvertime &&
        err.kind !== AlgorithmErrorCode.WorkerUnderTime
    );
    const overtimeAndUndetimeErrors: (WorkerOvertime | WorkerUnderTime)[] = [];
    Object.keys(actualSchedule.shifts).forEach((workerName) => {
      const workHoursDiff = calculateOvertime(workerName);
      if (workHoursDiff < 0) {
        overtimeAndUndetimeErrors.push({
          kind: AlgorithmErrorCode.WorkerUnderTime,
          hours: Math.abs(workHoursDiff),
          worker: workerName,
        });
      }
    });
    return _.concat(validBackendScheduleErros, overtimeAndUndetimeErrors);
  }
}
