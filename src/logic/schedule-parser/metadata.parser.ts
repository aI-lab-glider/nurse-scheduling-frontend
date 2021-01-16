/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */

import {WeekDay} from "../../common-models/month-info.model";
import {MetadataProvider} from "../providers/metadata-provider.model";
import {MonthInfoLogic} from "../schedule-logic/month-info.logic";
import {InputFileErrorCode, ScheduleError} from "../../common-models/schedule-error.model";

export class MetaDataParser extends MetadataProvider {
  public monthLogic: MonthInfoLogic;
  private _parseErrors: ScheduleError[] = [];
  private _days: number[] = [];

  constructor(month: number, year: number, raw: string[][]) {
    super();

    const [days] = this.extractMetadata(raw);
    this._days = days;
    this.monthLogic = new MonthInfoLogic(month, year.toString(), days);
  }

  public get errors(): ScheduleError[] {
    return [...this._parseErrors];
  }

  private logLoadFIleError(msg: string): void {
    this._parseErrors.push({
      kind: InputFileErrorCode.LOAD_FILE_ERROR,
      message: msg,
    });
  }

  private extractMetadata(raw: string[][]): [number[]] {
    if (raw.length !== 2) {
      this.logLoadFIleError("Nie znaleziono spdoziewanej ilości wierszy w sekcji dane");
      return [[]];
    }

    if (raw[1].length < 2) {
      this.logLoadFIleError("Nie znaleziono dni miesiąca w sekcji danych");
      return [[]];
    }


    const monthDays = raw[1].slice(1);

    const days = Array<number>();

    monthDays.forEach((a, id) => {
      var numDay = parseInt(a);
      if (typeof numDay !== "number" || numDay < 1 || numDay > 31) {
        this.logLoadFIleError(
          "Nieodpowiednie dane wpisane w dniu miesiąca w kolumnie numer " + (id + 1)
        );
        numDay = days[days.length] + 1;
      }
      days.push(numDay);
    });

    return [days];
  }


  public get dates(): number[] {
    return this.monthLogic.dates;
  }

  get frozenDates(): [string | number, number][] {
    return [];
  }

  public get frozenDays(): [number, number][] {
    return this.monthLogic.verboseDates
      .filter((date) => date.isFrozen)
      .map((date, index) => [0, index + 1]);
  }

  public get monthNumber(): number {
    return this.monthLogic.monthNumber;
  }

  public get dayCount(): number {
    return this.monthLogic.dayCount;
  }

  public get year(): number {
    return parseInt(this.monthLogic.year);
  }

  public get daysOfWeek(): WeekDay[] {
    return this.monthLogic.daysOfWeek;
  }

  public get dayNumbers(): number[] {
    return this.monthLogic.dates;
  }

  public get validDataStart(): number {
    return 0;
  }

  public get validDataEnd(): number {
    return this.monthLogic.dates.length - 1;
  }
}
