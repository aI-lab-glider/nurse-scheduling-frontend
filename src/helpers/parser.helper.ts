/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */

export const EMPTY_ROW_SIZE = 40;
export const EMPTY_ROW = Array(EMPTY_ROW_SIZE).fill("");

export const WORKSHEET_NAME = "grafik";
export const WORKERS_WORKSHEET_NAME = "pracownicy";
export const SHIFTS_WORKSHEET_NAME = "zmiany";

const NAZWA_ZMIANY = "Nazwa zmiany";
const SKROT = "Skrót";
const OD = "Od";
const DO = "Do";
const ZMIANA_PRACUJACA = "Zmiana pracująca";
const KOLOR = "Kolor";
export const SHIFT_HEADERS = [NAZWA_ZMIANY, SKROT, OD, DO, ZMIANA_PRACUJACA, KOLOR];

export const WORKER_HEADERS = [
  "Imię i nazwisko",
  "Stanowisko/funkcja",
  "Rodzaj umowy",
  "Wymiar czasu pracy",
  "Zespół",
];
const CELLS_TO_AVOID = [WORKSHEET_NAME, NAZWA_ZMIANY];

export class ParserHelper {
  public static isEmptyRow(rowValues: Array<string>): boolean {
    const rowValuesSet = new Set(rowValues.map((a) => a.toString()));

    return (
      rowValuesSet.size === 0 ||
      (rowValuesSet.size === 1 && rowValuesSet.has("")) ||
      Array.from(rowValuesSet).some((a) => typeof a === "undefined") ||
      contains(CELLS_TO_AVOID) ||
      contains(WORKER_HEADERS)
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
}
