/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import { InputFileErrorCode, ScheduleError } from "../../common-models/schedule-error.model";
import { Shift } from "../../common-models/shift-info.model";
import { AcronymGenerator } from "../../helpers/acronym-generator.helper";

export const DEFAULT_SHIFT_NAME = "Nowa zmiana";
export const DEFAULT_FROM = 0;
export const DEFAULT_TO = 24;
export const DEFAULT_IS_WORKING = false;
export const DEFAULT_COLOR = { name: "żółty", value: "FFD100" };

export class ShiftsProperInfoParser {
  private namelessShifts: number;
  private _shiftsInfoRows: { [key: string]: Shift } = {};
  private _parseErrors: ScheduleError[] = [];

  constructor(data: string[][]) {
    this.namelessShifts = 0;
    data.forEach((a) => {
      const worker = this.mapShift(a);
      this._shiftsInfoRows[worker.name] = worker;
    });
  }

  public get errors(): ScheduleError[] {
    return [...this._parseErrors];
  }

  public get shiftsDescriptions(): Shift[] {
    return Object.values(this._shiftsInfoRows);
  }

  private logLoadFileError(msg: string): void {
    this._parseErrors.push({
      kind: InputFileErrorCode.LOAD_FILE_ERROR,
      message: msg,
    });
  }

  private parseShiftName(shiftRow: string[]): string {
    if (shiftRow[0] && shiftRow[0] !== "") {
      return shiftRow[0];
    }

    const generatedName = this.generateDefaultName();
    this.logLoadFileError("Nie ustawiono nazwy dla zmiany. Ustawiono: " + generatedName);
    return generatedName;
  }

  private generateDefaultName(): string {
    return DEFAULT_SHIFT_NAME + ++this.namelessShifts;
  }

  private parseShiftCode(shiftRow: string[], name: string): string {
    if (shiftRow[1]) {
      return shiftRow[1];
    } else {
      const generatedCode = AcronymGenerator.generate(name);

      this.logLoadFileError(
        "Nie ustawiono skrótu dla zmiany: " + name + ". Ustawiono: " + generatedCode
      );
      return generatedCode;
    }
  }

  private parseShiftFrom(shiftRow: string[], name: string): number {
    if (shiftRow[2]) {
      const number = parseInt(shiftRow[2].trim());
      if (isNaN(number) || number < 0 || number > 24) {
        this.logLoadFileError(
          "Nieoczekiwana wartość dla początku zmiany: " + name + ". Ustawiono: " + DEFAULT_FROM
        );
      } else {
        return number;
      }
    } else {
      this.logLoadFileError(
        "Nie ustawiono początku zmiany: " + name + ". Ustawiono: " + DEFAULT_FROM
      );
    }
    return DEFAULT_FROM;
  }

  private parseShiftTo(shiftRow: string[], name: string): number {
    if (shiftRow[3]) {
      const number = parseInt(shiftRow[3].trim());
      if (isNaN(number) || number < 0 || number > 24) {
        this.logLoadFileError(
          "Nieoczekiwana wartość dla początku zmiany: " + name + ". Ustawiono: " + DEFAULT_TO
        );
      } else {
        return number;
      }
    } else {
      this.logLoadFileError(
        "Nie ustawiono początku zmiany: " + name + ". Ustawiono: " + DEFAULT_TO
      );
    }
    return DEFAULT_TO;
  }

  private parseShiftIsWorking(shiftRow: string[], name: string): boolean {
    if (shiftRow[4]) {
      const isWorkingShift = shiftRow[4].trim().toLowerCase();
      if (isWorkingShift === "tak") {
        return true;
      } else if (isWorkingShift === "nie") {
        return false;
      } else {
        this.logLoadFileError(
          "Nieoczekiwana wartość dla rodzaju zmiany: " +
            name +
            ". Ustawiono: " +
            (DEFAULT_IS_WORKING ? "TAK" : "NIE")
        );
      }
    } else {
      this.logLoadFileError(
        "Nie ustawiono czy zmiana: " +
          name +
          " jest pracująca. Ustawiono: " +
          (DEFAULT_IS_WORKING ? "TAK" : "NIE")
      );
    }
    return DEFAULT_IS_WORKING;
  }

  private parseShiftColor(shiftRow: string[], name: string): string {
    if (shiftRow[5]) {
      return shiftRow[5];
    } else {
      this.logLoadFileError(
        "Nie ustawiono koloru dla zmiany: " + name + ". Ustawiono: " + DEFAULT_COLOR.name
      );
      return DEFAULT_COLOR.value;
    }
  }

  private mapShift(row: string[]): Shift {
    const name = this.parseShiftName(row);
    const code = this.parseShiftCode(row, name);
    const from = this.parseShiftFrom(row, name);
    const to = this.parseShiftTo(row, name);
    const isWorkingShift = this.parseShiftIsWorking(row, name);
    const color = this.parseShiftColor(row, name);

    return {
      name: name,
      code: code,
      from: from,
      to: to,
      isWorkingShift: isWorkingShift,
      color: color,
    };
  }
}
