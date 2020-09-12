import axios, { AxiosInstance } from "axios";
import { ScheduleDataModel } from "../state/models/schedule-data/schedule-data.model";
import { ScheduleErrorModel } from "../state/models/schedule-data/schedule-error.model";

class Backend {
  axios: AxiosInstance;

  constructor() {
    this.axios = axios.create({
      baseURL: "http://127.0.0.1:5000/",
    });
  }

  getErrors(schedule: ScheduleDataModel): Promise<ScheduleErrorModel[]> {
    return this.axios.post("/schedule_errors/", schedule).then((resp) => resp.data);
  }
}

export default new Backend();
