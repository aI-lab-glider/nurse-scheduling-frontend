/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */

import { DEFAULT_FROM } from "../logic/schedule-parser/shifts-types-info.parser";
import { Shift } from "../state/schedule-data/shifts-types/shift-types.model";

export const EMPTY_ROW_SIZE = 40;
export const EMPTY_ROW = Array(EMPTY_ROW_SIZE).fill("");

export const WORKSHEET_NAME = "grafik";
export const WORKERS_WORKSHEET_NAME = "pracownicy";
export const SHIFTS_WORKSHEET_NAME = "zmiany";
export const LEAVES_WORKSHEET_NAME = "zwolnienia";

const NAZWA_ZMIANY = "Nazwa zmiany";
const SKROT = "Skrót";
const OD = "Od";
const DO = "Do";
const ZMIANA_PRACUJACA = "Zmiana pracująca";
const KOLOR = "Kolor";
export const SHIFT_HEADERS = [NAZWA_ZMIANY, SKROT, OD, DO, ZMIANA_PRACUJACA, KOLOR];

const IMIE_I_NAZWISKO = "Imię i nazwisko";
const STANOWISKO_FUNKCJA = "Stanowisko/funkcja";
const RODZAJ_UMOWY = "Rodzaj umowy";
const WYMIAR_CZASU_PRACY = "Wymiar czasu pracy";
const ZESPOL = "Zespół";
export const WORKER_HEADERS = [
  IMIE_I_NAZWISKO,
  STANOWISKO_FUNKCJA,
  RODZAJ_UMOWY,
  WYMIAR_CZASU_PRACY,
  ZESPOL,
];
const CELLS_TO_AVOID = [
  WORKSHEET_NAME,
  NAZWA_ZMIANY,
  IMIE_I_NAZWISKO,
  STANOWISKO_FUNKCJA,
  RODZAJ_UMOWY,
  WYMIAR_CZASU_PRACY,
];

export const ABSENCE_HEADERS = [IMIE_I_NAZWISKO, "Typ", "Od", "Do", "Ile dni", "Ile godzin"];

export class ParserHelper {
  public static isEmptyRow(rowValues: Array<string>): boolean {
    const rowValuesSet = new Set(rowValues.map((a) => a.toString()));

    return (
      rowValuesSet.size === 0 ||
      (rowValuesSet.size === 1 && rowValuesSet.has("")) ||
      Array.from(rowValuesSet).some((a) => typeof a === "undefined") ||
      contains(CELLS_TO_AVOID)
    );

    function contains(cellToAvoid: Array<string>): boolean {
      return Array.from(rowValuesSet).some((setItem) =>
        cellToAvoid.some((cellToAvoid) =>
          setItem.trim().toLowerCase().includes(cellToAvoid.trim().toLowerCase())
        )
      );
    }
  }

  public static translateStringToBoolean(key: string): boolean | undefined {
    switch (key.trim().toLowerCase()) {
      case "yes":
      case "tak":
        return true;
      case "no":
      case "nie":
        return false;
    }
    return undefined;
  }

  public static translateBooleanToString(key: boolean | undefined, inEnglish = false): string {
    switch (key) {
      case true:
        return inEnglish ? "yes" : "tak";
      case false:
      default:
        return inEnglish ? "no" : "nie";
    }
  }

  static getShiftHeaderIndex(code: string): number {
    return SHIFT_HEADERS.indexOf(code);
  }

  public static getShiftNameHeaderIndex(): number {
    return this.getShiftHeaderIndex(NAZWA_ZMIANY);
  }

  public static getShiftStartHeaderIndex(): number {
    return this.getShiftHeaderIndex(OD);
  }

  public static getShiftEndHeaderIndex(): number {
    return this.getShiftHeaderIndex(DO);
  }

  public static getShiftIsWorkingHeaderIndex(): number {
    return this.getShiftHeaderIndex(ZMIANA_PRACUJACA);
  }

  public static getShiftCodeHeaderIndex(): number {
    return this.getShiftHeaderIndex(SKROT);
  }

  public static getShiftColorHeaderIndex(): number {
    return this.getShiftHeaderIndex(KOLOR);
  }

  public static shiftPassesDayStart(shift: Shift): boolean {
    return shift.isWorkingShift
      ? shift.from <= shift.to
        ? shift.from < DEFAULT_FROM && DEFAULT_FROM < shift.to
        : DEFAULT_FROM < shift.to || shift.from < DEFAULT_FROM
      : false;
  }
}
