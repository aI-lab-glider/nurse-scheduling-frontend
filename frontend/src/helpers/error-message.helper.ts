import {
  ScheduleErrorLevel,
  ScheduleErrorMessageModel,
} from "../common-models/schedule-error-message.model";
import {
  AlgorithmErrorCode,
  ParseErrorCode,
  ScheduleErrorModel,
} from "../common-models/schedule-error.model";
import { ColorHelper } from "./colors/color.helper";
import { Color, Colors } from "./colors/color.model";

type Error = ScheduleErrorLevel;

export class ErrorMessageHelper {
  public static getErrorMessage(error: ScheduleErrorModel): ScheduleErrorMessageModel {
    const dayTimeTranslations = {
      MORNING: "porannej",
      AFTERNOON: "popołudniowej",
      NIGHT: "nocnej",
    };

    const code = error.code;
    let message: string;

    switch (code) {
      case AlgorithmErrorCode.AON:
        message = `Brak pielęgniarek w dniu ${error.day} na zmianie ${
          error.day_time ? dayTimeTranslations[error.day_time] : ""
        }`;
        break;
      case AlgorithmErrorCode.WND:
        message = `Za mało pracowników w trakcie dnia w dniu ${error.day}, potrzeba ${error.required}, jest ${error.actual}`;
        break;
      case AlgorithmErrorCode.WNN:
        message = `Za mało pracowników w nocy w dniu ${error.day}, potrzeba ${error.required}, jest ${error.actual}`;
        break;
      case AlgorithmErrorCode.DSS:
        message = `Niedozwolona sekwencja zmian dla pracownika ${error.worker} w dniu ${error.day}: ${error.succeeding} po ${error.preceding}`;
        break;
      case AlgorithmErrorCode.LLB:
        message = `Brak wymaganej długiej przerwy dla pracownika ${error.worker} w tygodniu ${error.week}`;
        break;
      case AlgorithmErrorCode.WUH:
        message = `Pracownik ${error.worker} ma ${error.hours} niedogodzin`;
        break;
      case AlgorithmErrorCode.WOH:
        message = `Pracownik ${error.worker} ma ${error.hours} nadgodzin`;
        break;
      case ParseErrorCode.UNKNOWN_VALUE:
        message = `Niedozwolona wartość zmiany: ${error.actual}, w dniu ${error.day} u pracownika ${error.worker}`;
        break;
      default:
        message = "Nieznany błąd";
        break;
    }
    const level = AlgorithmErrorCode[code]
      ? ScheduleErrorLevel.CRITICAL_ERROR
      : ScheduleErrorLevel.WARNING;
    return { code, message, worker: error.worker, day: error.day, week: error.week, level };
  }

  public static getErrorColor(error: Error): Color {
    return (
      {
        [ScheduleErrorLevel.INFO]: Colors.DARK_RED.fade(0.4),
        [ScheduleErrorLevel.WARNING]: Colors.TUSCANY.fade(0.4),
      }[error] ?? ColorHelper.getDefaultColor()
    );
  }
}
