/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import axios, { AxiosInstance } from "axios";
import { ScheduleDataModel } from "../common-models/schedule-data.model";
import { ScheduleError } from "../common-models/schedule-error.model";
import { Shift, SHIFTS } from "../common-models/shift-info.model";

interface BackendErrorObject extends Omit<ScheduleError, "kind"> {
  code: string;
}
interface BackendShiftModel extends Shift {
  is_working_shift: boolean;
}

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
    );
  }

  public fixSchedule(schedule: ScheduleDataModel): Promise<ScheduleDataModel[]> {
    return this.axios.post("/fix_schedule", schedule).then((resp) => resp.data);
  }
}

export default new Backend();
