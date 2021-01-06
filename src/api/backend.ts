/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import axios, { AxiosInstance } from "axios";
import { ScheduleDataModel } from "../common-models/schedule-data.model";
import { ScheduleError } from "../common-models/schedule-error.model";

interface BackendErrorObject extends Omit<ScheduleError, "kind"> {
  code: string;
}
class Backend {
  axios: AxiosInstance;

  constructor() {
    this.axios = axios.create({
      baseURL: "http://127.0.0.1:8000/",
    });
  }

  public getErrors(schedule: ScheduleDataModel): Promise<ScheduleError[]> {
    return this.axios
      .post("/schedule_errors", schedule)
      .then((resp) => resp.data.map((el: BackendErrorObject) => ({ ...el, kind: el.code })));
  }

  public fixSchedule(schedule: ScheduleDataModel): Promise<ScheduleDataModel[]> {
    return this.axios.post("/fix_schedule", schedule).then((resp) => resp.data);
  }
}

export default new Backend();
