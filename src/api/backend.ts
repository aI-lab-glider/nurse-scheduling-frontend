/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import axios, { AxiosInstance } from "axios";
import { ScheduleDataModel } from "../common-models/schedule-data.model";
import { ScheduleError } from "../common-models/schedule-error.model";
import { Shift, SHIFTS } from "../common-models/shift-info.model";
import { v4 as uuidv4 } from "uuid";

interface BackendErrorObject extends Omit<ScheduleError, "kind"> {
  code: string;
}

interface BackendShiftModel extends Shift {
  is_working_shift: boolean;
}

function escapeJuliaIndexes(error: ScheduleError): ScheduleError {
  const indexFields = ["day", "week"];
  indexFields.forEach((field) => {
    if (error[field]) {
      error = { ...error, [field]: error[field] - 1 };
    }
  });
  return error;
}

type NameUuidMapper = {
  [name: string]: string;
};

const nameToUuid: NameUuidMapper = {};

class Backend {
  axios: AxiosInstance;

  constructor() {
    this.axios = axios.create({
      baseURL: process.env.REACT_APP_SOLVER_API_URL,
    });
  }

  public sleep<T>(ms: number): Promise<T> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  public getErrors(schedule: ScheduleDataModel): Promise<ScheduleError[]> {
    /* eslint-disable @typescript-eslint/camelcase */
    Object.keys(schedule.shifts).map(
      (shiftName): void => (nameToUuid[shiftName] = uuidv4(shiftName))
    );

    // eslint-disable-next-line array-callback-return
    Object.keys(schedule.shifts).map((shiftName) => {
      schedule.shifts[nameToUuid[shiftName]] = schedule.shifts[shiftName];
      delete schedule.shifts[shiftName];
    });

    // eslint-disable-next-line array-callback-return
    Object.keys(schedule.employee_info.time).map((shiftName) => {
      schedule.employee_info.time[nameToUuid[shiftName]] = schedule.employee_info.time[shiftName];
      delete schedule.employee_info.time[shiftName];
    });

    // eslint-disable-next-line array-callback-return
    Object.keys(schedule.employee_info.type).map((shiftName) => {
      schedule.employee_info.type[nameToUuid[shiftName]] = schedule.employee_info.type[shiftName];
      delete schedule.employee_info.type[shiftName];
    });

    schedule.shift_types = {};
    Object.keys(SHIFTS).forEach((shiftCode) => {
      schedule.shift_types![shiftCode] = {
        ...SHIFTS[shiftCode],
        is_working_shift: SHIFTS[shiftCode].isWorkingShift,
      };
    });

    return this.sleep(1000).then(() =>
      this.axios
        .post("/schedule_errors", schedule)
        .then((resp) => resp.data.map((el: BackendErrorObject) => ({ ...el, kind: el.code })))
        .then((errors) => errors.map(escapeJuliaIndexes))
        .then((errors) => errors.map(this.remapUsernames))
    );
  }

  private remapUsernames(el: any): ScheduleError {
    if (el.worker !== undefined) {
      Object.keys(nameToUuid).forEach((workerName) => {
        if (nameToUuid[workerName] === el.worker) el.worker = workerName;
      });
    }
    return el;
  }

  public fixSchedule(schedule: ScheduleDataModel): Promise<ScheduleDataModel[]> {
    return this.axios.post("/fix_schedule", schedule).then((resp) => resp.data);
  }
}

export default new Backend();
