/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import { VerboseDate, WeekDay } from "../../common-models/month-info.model";
import { Sections } from "../providers/schedule-provider.model";
import { DataRow } from "./data-row";
import { MonthInfoLogic } from "./month-info.logic";
import { BaseSectionLogic } from "./base-section-logic.model";
import { MetaDataSectionKey } from "../section.model";
import { MetadataProvider } from "../providers/metadata-provider.model";
export enum MonthLogicActionType {
  UpdateFrozenDates = "updateFrozenDates",
}

export class MetadataLogic extends BaseSectionLogic implements MetadataProvider {
  get sectionKey(): keyof Sections {
    return "Metadata";
  }

  private _frozenShifts: [number, number][] = [];
  public changeShiftFrozenState(workerIndex: number, index: number): [number, number][] {
    const blockedPairInd = this._frozenShifts.findIndex(
      (pair) => pair[0] === workerIndex && pair[1] === index
    );
    if (blockedPairInd !== -1) {
      this._frozenShifts = this._frozenShifts.filter((v, index) => index !== blockedPairInd);
    } else {
      this._frozenShifts.push([workerIndex, index]);
    }
    return this.frozenDates;
  }

  public monthLogic: MonthInfoLogic;
  private _year: string;
  private month: number;
  constructor(year?: string, month?: number, monthDates: number[] = []) {
    super([new DataRow(MetaDataSectionKey.MonthDays, monthDates)]);
    const today = new Date();
    this._year = year ?? today.getFullYear().toString();
    this.month = month ?? today.getMonth();
    this.monthLogic = new MonthInfoLogic(this.month, this._year, monthDates);
  }

  public get verboseDates(): VerboseDate[] {
    return this.monthLogic.verboseDates;
  }

  public get frozenDates(): [number, number][] {
    return [
      ...(this.verboseDates
        .filter((date) => date.isFrozen)
        .map((date, index) => [0, index + 1]) as [number, number][]),
      ...this._frozenShifts,
    ];
  }
  public get monthNumber(): number {
    return this.monthLogic.monthNumber;
  }
  public get dayCount(): number {
    return this.monthLogic.dayCount;
  }

  public get year(): number {
    return parseInt(this._year);
  }

  public get daysOfWeek(): WeekDay[] {
    return this.monthLogic.daysOfWeek;
  }

  public get dates(): number[] {
    return this.monthLogic.verboseDates.map((d) => d.date);
  }
}
