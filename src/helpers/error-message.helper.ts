/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import {
  ScheduleErrorLevel,
  ScheduleErrorMessageModel,
  ScheduleErrorType,
} from "../common-models/schedule-error-message.model";
import {
  AlgorithmErrorCode,
  InputFileErrorCode,
  NetworkErrorCode,
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
    let title = "Nie rozpoznano błędu";
    let day = 0;
    let type = ScheduleErrorType.OTH;

    switch (error.kind) {
      case AlgorithmErrorCode.AON:
        message = `Brak pielęgniarek w dniu ${error.day} na zmianie ${
          error.day_time ? dayTimeTranslations[error.day_time] : ""
        }`;
        type = ScheduleErrorType.AON;
        title = "date";
        if (error.day) {
          day += error.day;
        }
        break;
      case AlgorithmErrorCode.WND:
        message = `Za mało pracowników w trakcie dnia w dniu ${error.day}, potrzeba ${error.required}, jest ${error.actual}`;
        type = ScheduleErrorType.WND;
        title = "date";
        if (error.day) {
          day += error.day;
        }
        break;
      case AlgorithmErrorCode.WNN:
        message = `Za mało pracowników w nocy w dniu ${error.day}, potrzeba ${error.required}, jest ${error.actual}`;
        type = ScheduleErrorType.WNN;
        title = "date";
        if (error.day) {
          day += error.day;
        }
        break;
      case AlgorithmErrorCode.DSS:
        message = `Niedozwolona sekwencja zmian dla pracownika ${error.worker} w dniu ${error.day}: ${error.succeeding} po ${error.preceding}`;
        type = ScheduleErrorType.DSS;
        title = "date";
        if (error.day) {
          day += error.day;
        }
        break;
      case AlgorithmErrorCode.LLB:
        message = `Brak wymaganej długiej przerwy dla pracownika ${error.worker} w tygodniu ${error.week}`;
        type = ScheduleErrorType.LLB;
        title = `${error.worker}`;
        break;
      case AlgorithmErrorCode.WUH:
        message = `Pracownik ${error.worker} ma ${error.hours} niedogodzin`;
        type = ScheduleErrorType.WUH;
        title = `${error.worker}`;
        break;
      case AlgorithmErrorCode.WOH:
        message = `Pracownik ${error.worker} ma ${error.hours} nadgodzin`;
        type = ScheduleErrorType.WOH;
        title = `${error.worker}`;
        break;
      case ParseErrorCode.UNKNOWN_VALUE:
        message = `Niedozwolona wartość zmiany: ${error.actual}, w dniu ${error.day} u pracownika ${error.worker}`;
        type = ScheduleErrorType.ILLEGAL_SHIFT_VALUE;
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
      case NetworkErrorCode.NETWORK_ERROR:
        message = "Błąd połączenia";
        title = "Błąd połączenia";
        break;
      default:
        message = "Nieznany błąd";
        break;
    }
    const level = AlgorithmErrorCode[kind]
      ? ScheduleErrorLevel.CRITICAL_ERROR
      : ScheduleErrorLevel.WARNING;
    return { kind, title, day, message, level, type };
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
