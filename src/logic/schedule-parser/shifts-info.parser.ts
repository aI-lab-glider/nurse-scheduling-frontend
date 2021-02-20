/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import {
  InputFileErrorCode,
  ParseErrorCode,
  ScheduleError,
} from "../../common-models/schedule-error.model";
import { ShiftCode } from "../../common-models/shift-info.model";
import { ShiftsProvider } from "../providers/shifts-provider.model";
import { DataRowParser } from "./data-row.parser";
import { MetaDataParser } from "./metadata.parser";
import { WorkerType, WorkerTypeHelper } from "../../common-models/worker-info.model";

export class ShiftsInfoParser extends ShiftsProvider {
  private _sectionRows: { [key: string]: DataRowParser } = {};
  private _parseErrors: ScheduleError[] = [];

  constructor(typeOfPersonel: WorkerType, private metaData: MetaDataParser, data?: string[][]) {
    super();

    if (data) {
      this.myPersonel(data).forEach((row) => {
        this._sectionRows[row.rowKey] = row;
      });
    } else {
      this.logLoadFileError(
        "Nie znaleziono sekcji : " + WorkerTypeHelper.translate(typeOfPersonel, true)
      );
    }
  }

  public get errors(): ScheduleError[] {
    return [...this._parseErrors];
  }

  private myPersonel(raw: string[][]): DataRowParser[] {
    const sectionData: DataRowParser[] = [];

    raw.forEach((personelRow) => {
      if (personelRow.length > 1) {
        const slicedPersonelRow = personelRow.slice(
          this.metaData.offset,
          this.metaData.offset + this.metaData.dayCount
        );

        if (slicedPersonelRow.length !== this.metaData.dayCount) {
          this.logLoadFileError(
            "Sekcja nie ma oczekiwanych wymiarów. Przyjęto, że w brakujących dniach liczba dzieci wynosi 0"
          );
        }

        const personel = Array<string>();

        const name = personelRow[0];
        personel.push(name);
        for (let i = 0; i < this.metaData.dayCount; i++) {
          const b = slicedPersonelRow[i];
          if (b === " " || b === "") {
            personel.push("W");
          } else {
            if (typeof b !== "string" || !(b in ShiftCode)) {
              this.logUnknownValue(i + 1, name, b);
              personel.push("W");
            } else {
              personel.push(b);
            }
          }
        }

        sectionData.push(new DataRowParser(personel));
      }
    });
    return sectionData;
  }

  public get sectionData(): DataRowParser[] {
    return Object.values(this._sectionRows);
  }

  private mockAvailableWorkersWorkTime(): { [key: string]: number } {
    const workerDict = {};
    Object.keys(this.workerShifts).forEach((key) => (workerDict[key] = 1.0));
    return workerDict;
  }

  public get availableWorkersWorkTime(): { [key: string]: number } {
    // TODO: implement actual parsing of worker work time
    return this.mockAvailableWorkersWorkTime();
  }

  public get workersCount(): number {
    return this.sectionData.length;
  }

  public get workerShifts(): { [workerName: string]: ShiftCode[] } {
    if (this.workersCount > 0) {
      return this.sectionData
        .map((row) => ({
          [row.rowKey]: this.fillRowWithShifts(row),
        }))
        .reduce((prev, curr) => ({ ...prev, ...curr }));
    } else {
      return {};
    }
  }

  private static getShiftFromCell(cell: string): ShiftCode | null {
    return ShiftCode[cell?.trim().slice(0, 2).trim()];
  }

  private fillRowWithShifts(row: DataRowParser): ShiftCode[] {
    const continuousShifts = [ShiftCode.L4, ShiftCode.U];
    let previousShift: ShiftCode = ShiftCode.W;
    return row.rowData(true, false).map((cellValue, cellInd) => {
      let currentShiftValue = ShiftsInfoParser.getShiftFromCell(cellValue);
      if (!currentShiftValue) {
        if (cellValue && cellValue.trim()) {
          const currDate = this.metaData.dates[cellInd];
          this.logUnknownValue(currDate, row.rowKey, cellValue);
        }
        currentShiftValue = continuousShifts.includes(previousShift) ? previousShift : ShiftCode.W;
      }
      previousShift = currentShiftValue;
      return currentShiftValue;
    });
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private logUnknownValue(date: number, worker: string, value: any): void {
    this._parseErrors.push({
      kind: ParseErrorCode.UNKNOWN_VALUE,
      day: date,
      worker: worker,
      actual: value,
    });
  }

  private logLoadFileError(msg: string): void {
    this._parseErrors.push({
      kind: InputFileErrorCode.LOAD_FILE_ERROR,
      message: msg,
    });
  }
}
