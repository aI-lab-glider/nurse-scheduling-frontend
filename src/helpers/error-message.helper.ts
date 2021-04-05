/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import {
  ScheduleErrorLevel,
  ScheduleErrorMessageModel,
  ScheduleErrorType,
} from "../state/schedule-data/schedule-errors/schedule-error-message.model";
import {
  AlgorithmErrorCode,
  GroupedScheduleErrors,
  InputFileErrorCode,
  NetworkErrorCode,
  ParseErrorCode,
  ScheduleError,
} from "../state/schedule-data/schedule-errors/schedule-error.model";
import { ShiftsTypesDict } from "../state/schedule-data/shifts-types/shift-types.model";
import { ColorHelper } from "./colors/color.helper";
import { Color, Colors } from "./colors/color.model";
import { ShiftHelper } from "./shifts.helper";
import { TranslationHelper } from "./translations.helper";

type Error = ScheduleErrorLevel;

export class ErrorMessageHelper {
  public static mapScheduleErrors(
    errors: GroupedScheduleErrors,
    shiftTypes: ShiftsTypesDict
  ): ScheduleErrorMessageModel[] {
    const mappedErrors = Object.values(errors).reduce(
      (previous, current) => [
        ...previous,
        ...(current ?? []).map((error) => ErrorMessageHelper.getErrorMessage(error, shiftTypes)),
      ],
      [] as ScheduleErrorMessageModel[]
    );
    return mappedErrors;
  }

  public static getErrorMessage(
    error: ScheduleError,
    shiftsTypes: ShiftsTypesDict
  ): ScheduleErrorMessageModel {
    const kind = error.kind;
    let message = ``;
    let title = "Nie rozpoznano błędu";
    let day = 0;
    let i = 0;
    let type = ScheduleErrorType.OTH;
    let newline = false;

    switch (error.kind) {
      case AlgorithmErrorCode.AlwaysAtLeastOneNurse:
        i = 0;
        if (error.segments[i][0] !== 7 || error.segments[i][1] !== 7) {
          message += `<b>${error.segments[i][0]}:00-${error.segments[i][1]}:00</b>`;
          newline = true;
        }
        while (error.segments[i + 1]) {
          i++;
          if (error.segments[i][0] !== 7 || error.segments[i][1] !== 7) {
            message += `, <b>${error.segments[i][0]}:00-${error.segments[i][1]}:00</b>`;
          }
        }
        message += `${newline ? `<br>b` : `B`}rak pielęgniarek`;
        type = ScheduleErrorType.AON;
        title = "date";
        if (error.day) {
          day += error.day;
        }
        break;
      case AlgorithmErrorCode.WorkerNumberDuringDay:
        i = 0;
        if (error.segments && (error.segments[i][0] !== 6 || error.segments[i][1] !== 22)) {
          message += `<b>${error.segments[i][0]}:00-${error.segments[i][1]}:00</b>`;
          newline = true;
          while (error.segments[i + 1]) {
            i++;
            if (error.segments[i][0] !== 6 || error.segments[i][1] !== 22) {
              message += `, <b>${error.segments[i][0]}:00-${error.segments[i][1]}:00</b>`;
            }
          }
        }
        message += `${newline ? `<br>z` : `Z`}a mało pracowników w trakcie dnia: potrzeba <b>${
          error.required
        }</b>, jest <b>${error.actual}</b>.`;
        type = ScheduleErrorType.WND;
        title = "date";
        if (error.day) {
          day += error.day;
        }
        break;
      case AlgorithmErrorCode.WorkerNumberDuringNight:
        i = 0;
        if (error.segments && (error.segments[i][0] !== 22 || error.segments[i][1] !== 6)) {
          message += `<b>${error.segments[i][0]}:00-${error.segments[i][1]}:00</b>`;
          newline = true;
          while (error.segments[i + 1]) {
            i++;
            if (error.segments[i][0] !== 22 || error.segments[i][1] !== 6) {
              message += `, <b>${error.segments[i][0]}:00-${error.segments[i][1]}:00</b>`;
            }
          }
        }
        message += `${newline ? `<br>z` : `Z`}a mało pracowników w nocy: potrzeba <b>${
          error.required
        }</b>, jest <b>${error.actual}</b>.`;
        type = ScheduleErrorType.WNN;
        title = "date";
        if (error.day) {
          day += error.day;
        }
        break;
      case AlgorithmErrorCode.DissalowedShiftSequence:
        const timeNeeded = ShiftHelper.requiredFreeTimeAfterShift(shiftsTypes[error.preceding]);
        const [earliestPossible, nextDay] = ShiftHelper.nextLegalShiftStart(
          shiftsTypes[error.preceding]
        );
        let tooEarly = earliestPossible - shiftsTypes[error.succeeding].from;
        if (tooEarly < 1) tooEarly += 24;
        message = `Pracownik <strong>${
          error.worker
        }</strong> potrzebuje ${timeNeeded} godzin przerwy po zmianie <strong>${
          error.preceding
        }</strong>
          (${shiftsTypes[error.preceding].from}-${shiftsTypes[error.preceding].to}).
          Nie może mieć zmiany wcześniej niż o ${earliestPossible}`;
        if (nextDay) message += ` następnego dnia`;
        message += `. Przypisana zmiana <strong>${error.succeeding}</strong> (${
          shiftsTypes[error.succeeding].from
        }-${shiftsTypes[error.succeeding].to}) zaczyna się
        o ${tooEarly} ${TranslationHelper.hourAccusativus(tooEarly)} za wcześnie.`;
        type = ScheduleErrorType.DSS;
        title = "date";
        if (error.day) {
          day += error.day;
        }
        break;
      case AlgorithmErrorCode.LackingLongBreak:
        message = `<b>Tydzień ${error.week + 1}</b><br>brak wymaganej długiej przerwy.`;
        type = ScheduleErrorType.LLB;
        title = `${error.worker}`;
        break;
      case AlgorithmErrorCode.WorkerUnderTime:
        message = `<b>${error.hours}</b> niedo${TranslationHelper.hourAccusativus(error.hours)}`;
        type = ScheduleErrorType.WUH;
        title = `${error.worker}`;
        break;
      case ParseErrorCode.UNKNOWN_VALUE:
        message = `Nieznana wartość zmiany: "<b>${error.actual}</b>". Obecnie pole jest puste. Możesz ręcznie przypisać zmianę z tych już istniejących lub utworzyć nową.`;
        type = ScheduleErrorType.ILLEGAL_SHIFT_VALUE;
        title = `${error.worker}`;
        day += error.day! + 1;
        break;
      case InputFileErrorCode.EMPTY_FILE:
        message = `Błąd podczas wczytywania pliku wejściowego: Pusty plik`;
        break;
      case InputFileErrorCode.UNHANDLED_FILE_EXTENSION:
        message = `Nieobsługiwane rozszerzenie pliku: .${error.filename}`;
        break;
      case InputFileErrorCode.LOAD_FILE_ERROR:
        message = `${error.message}`;
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
