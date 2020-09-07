import axios, { AxiosInstance, AxiosResponse } from "axios";
import { ScheduleDataModel } from "../state/models/schedule-data/schedule-data.model";

class Backend {
  axios: AxiosInstance;

  constructor() {
    this.axios = axios.create({
      baseURL: "http://127.0.0.1:5000/",
    });
  }

  fixSchedule(schedule: ScheduleDataModel): Promise<AxiosResponse<string>> {
    return this.axios.post("/fix_schedule/", schedule);
  }
}

export default new Backend();
