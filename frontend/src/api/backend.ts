import axios, { AxiosInstance } from "axios";
import { ScheduleDataModel } from "../state/models/schedule-data/schedule-data.model";
import { ScheduleErrorMessageModel } from "../state/models/schedule-data/schedule-error-message.model";
import { ScheduleErrorModel } from "../state/models/schedule-data/schedule-error.model";

class Backend {
  axios: AxiosInstance;

  constructor() {
    this.axios = axios.create({
      baseURL: "http://127.0.0.1:8000/",
    });
  }

  mapErrorResponseToErrorMessage(error: ScheduleErrorModel): ScheduleErrorMessageModel {
    const dayTimeTranslations = {
      MORNING: "porannej",
      AFTERNOON: "popołudniowej",
      NIGHT: "nocnej",
    };

    const code = error.code;

    let message = "";

    switch (code) {
      case "AON":
        message = `Brak pielęgniarek w dniu ${error.day} na zmianie ${
          error.day_time ? dayTimeTranslations[error.day_time] : ""
        }`;
        break;
      case "WND":
        message = `Za mało pracowników w trakcie dnia w dniu ${error.day}, potrzeba ${error.required}, jest ${error.actual}`;
        break;
      case "WNN":
        message = `Za mało pracowników w nocy w dniu ${error.day}, potrzeba ${error.required}, jest ${error.actual}`;
        break;
      case "DSS":
        message = `Niedozwolona sekwencja zmian dla pracownika ${error.worker} w dniu ${error.day}: ${error.succeeding} po ${error.preceding}`;
        break;
      case "LLB":
        message = `Brak wymaganej długiej przerwy dla pracownika ${error.worker} w tygodniu ${error.week}`;
        break;
      case "WUH":
        message = `Pracownik ${error.worker} ma ${error.hours} niedogodzin`;
        break;
      case "WOH":
        message = `Pracownik ${error.worker} ma ${error.hours} nadgodzin`;
        break;
    }

    return { code, message, worker: error.worker, day: error.day, week: error.week };
  }

  getErrors(schedule: ScheduleDataModel): Promise<ScheduleErrorMessageModel[]> {
    return this.axios
      .post("/schedule_errors", schedule)
      .then((resp) => resp.data.map(this.mapErrorResponseToErrorMessage));
  }

  fixSchedule(schedule: ScheduleDataModel): Promise<ScheduleDataModel[]> {
    return this.axios.post("/fix_schedule", schedule).then((resp) => resp.data);
  }
}

export default new Backend();
