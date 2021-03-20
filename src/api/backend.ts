/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import axios, { AxiosInstance, AxiosRequestConfig } from "axios";
import { ScheduleDataModel } from "../common-models/schedule-data.model";
import { ScheduleError } from "../common-models/schedule-error.model";
import { PrimaryMonthRevisionDataModel } from "../state/models/application-state.model";
import { ServerMiddleware } from "./server.middleware";

interface BackendErrorObject extends Omit<ScheduleError, "kind"> {
  code: string;
}

class Backend {
  axios: AxiosInstance;

  constructor() {
    this.axios = axios.create({
      baseURL: process.env.REACT_APP_SOLVER_API_URL,
    });
    this.axios.interceptors.request.use(function (config): AxiosRequestConfig {
      config.headers.ApplicationVersionTag = process.env.REACT_APP_VERSION;
      return config;
    });
  }

  public sleep<T>(ms: number): Promise<T> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  public getErrors(
    schedule: ScheduleDataModel,
    baseScheduleRevision: PrimaryMonthRevisionDataModel
  ): Promise<ScheduleError[]> {
    const { anonynimizedSchedule, anonymizationMap } = ServerMiddleware.anonymizeSchedule(schedule);
    const validRequestSchedule = ServerMiddleware.mapIsWorkingTypeSnakeCase(anonynimizedSchedule);

    return this.sleep(1000).then(() =>
      this.axios
        .post("/schedule_errors", validRequestSchedule)
        .then((resp) => resp.data.map((el: BackendErrorObject) => ({ ...el, kind: el.code })))
        .then((errors) => errors.map(ServerMiddleware.escapeJuliaIndexes))
        .then((errors) =>
          ServerMiddleware.replaceOvertimeAndUndertimeErrors(
            validRequestSchedule,
            baseScheduleRevision,
            errors
          )
        )
        .then((errors) =>
          errors.map((error: ScheduleError) =>
            ServerMiddleware.remapScheduleErrorUsernames(error, anonymizationMap)
          )
        )
    );
  }
}

export default new Backend();
