import {
  ScheduleErrorLevel,
  ScheduleErrorMessageModel,
} from "../common-models/schedule-error-message.model";
import {
  AlgorithmErrorCode,
  InputFileErrorCode,
  ParseErrorCode,
  ScheduleError,
} from "../common-models/schedule-error.model";
import { ColorHelper } from "./colors/color.helper";
import { Color, Colors } from "./colors/color.model";

type Error = ScheduleErrorLevel;

export class ErrorMessageHelper {
  public static getErrorMessage(error: ScheduleError): ScheduleErrorMessageModel {
    const dayTimeTranslations = {
      MORNING: "porannej",
      AFTERNOON: "popołudniowej",
      NIGHT: "nocnej",
    };

    const kind = error.kind;
    let message: string;
    let title = "default title";

    switch (error.kind) {
      case AlgorithmErrorCode.AON:
        message = `Brak pielęgniarek w dniu ${error.day} na zmianie ${
          error.day_time ? dayTimeTranslations[error.day_time] : ""
        }`;
        title = "date";
        break;
      case AlgorithmErrorCode.WND:
        message = `Za mało pracowników w trakcie dnia w dniu ${error.day}, potrzeba ${error.required}, jest ${error.actual}`;
        title = "date";
        break;
      case AlgorithmErrorCode.WNN:
        message = `Za mało pracowników w nocy w dniu ${error.day}, potrzeba ${error.required}, jest ${error.actual}`;
        title = "date";
        break;
      case AlgorithmErrorCode.DSS:
        message = `Niedozwolona sekwencja zmian dla pracownika ${error.worker} w dniu ${error.day}: ${error.succeeding} po ${error.preceding}`;
        title = "date";
        break;
      case AlgorithmErrorCode.LLB:
        message = `Brak wymaganej długiej przerwy dla pracownika ${error.worker} w tygodniu ${error.week}`;
        title = `${error.worker}`;
        break;
      case AlgorithmErrorCode.WUH:
        message = `Pracownik ${error.worker} ma ${error.hours} niedogodzin`;
        title = `${error.worker}`;
        break;
      case AlgorithmErrorCode.WOH:
        message = `Pracownik ${error.worker} ma ${error.hours} nadgodzin`;
        title = `${error.worker}`;
        break;
      case ParseErrorCode.UNKNOWN_VALUE:
        message = `Niedozwolona wartość zmiany: ${error.actual}, w dniu ${error.day} u pracownika ${error.worker}`;
        title = `${error.worker}`;
        break;
      case InputFileErrorCode.EMPTY_FILE:
        message = `Błąd podczas wczytywania pliku wejściowego: Pusty plik`;
        break;
      case InputFileErrorCode.NO_BABYSITTER_SECTION:
        message = `Błąd podczas wczytywania pliku wejściowego: Nie znaleziono sekcji "opiekunki"`;
        break;
      case InputFileErrorCode.NO_NURSE_SECTION:
        message = `Błąd podczas wczytywania pliku wejściowego: Nie znaleziono sekcji "pielęgniarki"`;
        break;
      case InputFileErrorCode.NO_CHILDREN_SECTION:
        message = `Błąd podczas wczytywania pliku wejściowego: Nie znaleziono sekcji "dzieci"`;
        break;
      case InputFileErrorCode.INVALID_METADATA:
        message = `Błąd podczas wczytywania pliku wejściowego: Wykryto błędy w sekcji informacyjnej`;
        break;
      case InputFileErrorCode.NO_CHILDREN_QUANTITY:
        message = "Błąd podczas wczytywania pliku wejściowego: Nie podano liczby dzieci";
        break;
      default:
        message = "Nieznany błąd";
        break;
    }
    const level = AlgorithmErrorCode[kind]
      ? ScheduleErrorLevel.CRITICAL_ERROR
      : ScheduleErrorLevel.WARNING;
    return { kind, title, message, level };
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
