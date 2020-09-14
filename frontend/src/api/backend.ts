import axios, { AxiosInstance } from "axios";
import { ScheduleDataModel } from "../state/models/schedule-data/schedule-data.model";
import { ScheduleErrorModel } from "../state/models/schedule-data/schedule-error.model";
import { ScheduleErrorMessageModel } from "../state/models/schedule-data/schedule-error-message.model";

class Backend {
  axios: AxiosInstance;

  constructor() {
    this.axios = axios.create({
      baseURL: "http://127.0.0.1:5000/",
    });
  }

  // TODO: add mapping logic for various error codes and responses
  mapErrorResponseToErrorMessage(errorResponse: ScheduleErrorModel): ScheduleErrorMessageModel {
    return {
      code: errorResponse.code,
      message: errorResponse.code,
    };
  }

  getErrors(schedule: ScheduleDataModel): Promise<ScheduleErrorModel[]> {
    return this.axios
      .post("/schedule_errors/", schedule)
      .then((resp) => resp.data.map(this.mapErrorResponseToErrorMessage));
  }
}

export default new Backend();
