import axios, { AxiosInstance } from "axios";
import { ScheduleDataModel } from "../common-models/schedule-data.model";
import { ScheduleErrorModel } from "../common-models/schedule-error.model";

class Backend {
  axios: AxiosInstance;

  constructor() {
    this.axios = axios.create({
      baseURL: "http://127.0.0.1:8000/",
    });
  }

  public getErrors(schedule: ScheduleDataModel): Promise<ScheduleErrorModel[]> {
    return this.axios.post("/schedule_errors", schedule).then((resp) => resp.data);
  }

  public fixSchedule(schedule: ScheduleDataModel): Promise<ScheduleDataModel[]> {
    return this.axios.post("/fix_schedule", schedule).then((resp) => resp.data);
  }
}

export default new Backend();
