/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import { InputFileErrorCode, ScheduleError } from "../../common-models/schedule-error.model";
import { MetaDataParser } from "./metadata.parser";
import { ExtraWorkersInfoProvider } from "../providers/extra-workers-info-provider.model";

export class ExtraWorkersInfoParser implements ExtraWorkersInfoProvider {
  private _parseErrors: ScheduleError[] = [];
  private dayWorkers: number[];
  private DEFAULT_DAY_WORKERS_NUMBER = 0;

  constructor(private metaData: MetaDataParser, data?: string[][]) {
    this.dayWorkers = this.generateChildren(data);
  }

  public get errors(): ScheduleError[] {
    return [...this._parseErrors];
  }

  private logLoadFileError(msg: string): void {
    this._parseErrors.push({
      kind: InputFileErrorCode.LOAD_FILE_ERROR,
      message: msg,
    });
  }

  private generateChildren(raw?: string[][]): number[] {
    let dayWorkersRow;

    if (!raw || raw.length !== 1) {
      if (raw && raw.length === 3 && raw[1][0].toLowerCase() === "pracownicy dzienni") {
        dayWorkersRow = raw[1];
      } else {
        this.logLoadFileError(
          "Brak informacji o liczbie pracowników dziennych. Przyjęto, że w każdym dniu liczba pracowników dziennych wynosi " +
            this.DEFAULT_DAY_WORKERS_NUMBER
        );
        const N = this.metaData.dayCount;
        const dayWorkers = Array(N);
        let i = 0;

        while (i < N) dayWorkers[i++] = this.DEFAULT_DAY_WORKERS_NUMBER;
        return dayWorkers;
      }
    } else {
      dayWorkersRow = raw[0];
    }

    const slicedChildrenRow = dayWorkersRow.slice(
      this.metaData.offset,
      this.metaData.offset + this.metaData.dayCount
    );

    if (slicedChildrenRow.length !== this.metaData.dayCount) {
      this.logLoadFileError(
        "Sekcja pracownicy dzienni nie ma oczekiwanych wymiarów. Przyjęto, że w brakujących dniach liczba pracowników dziennych wynosi 0"
      );
    }

    const dayWorkers = Array<number>();
    for (let i = 0; i < this.metaData.dayCount; i++) {
      const numDay = parseInt(slicedChildrenRow[i]);
      if (isNaN(numDay) || numDay < 0) {
        this.logLoadFileError(
          "Nieoczekiwana wartość w sekcji pracownicy dzienni w dniu " +
            (i + 1) +
            ". Przyjęto, że liczba pracowników dziennych wynosi " +
            this.DEFAULT_DAY_WORKERS_NUMBER
        );
        dayWorkers.push(this.DEFAULT_DAY_WORKERS_NUMBER);
      } else {
        dayWorkers.push(numDay);
      }
    }

    return dayWorkers;
  }

  public get extraWorkers(): number[] {
    return this.dayWorkers;
  }

  public get workersCount(): number {
    return this.dayWorkers.reduce((a, b) => a + b, 0);
  }
}
