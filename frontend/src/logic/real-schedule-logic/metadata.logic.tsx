import { WeekDay } from "../../state/models/schedule-data/month-info.model";
import { MetadataProvider } from "../schedule-provider";
import { DataRow } from "./data-row";
import { MonthLogic, VerboseDate } from "./month.logic";
import { BaseSectionLogic } from "./section-logic.model";
export enum MonthLogicActionType {
  UpdateFrozenDates = "updateFrozenDates",
}

export class MetadataLogic extends BaseSectionLogic implements MetadataProvider {
  sectionKey = MetadataLogic.name;

  private translations = {
    dates_key: "Dni miesiąca",
  };

  private _frozenShifts: [number, number][] = [];
  public changeShiftFrozenState(workerIndex: number, index: number) {
    let blockedPairInd = this._frozenShifts.findIndex(
      (pair) => pair[0] === workerIndex && pair[1] === index
    );
    if (blockedPairInd !== -1) {
      this._frozenShifts = this._frozenShifts.filter((v, index) => index != blockedPairInd);
    } else {
      this._frozenShifts.push([workerIndex, index]);
    }
    return this.frozenDates;
  }

  public monthLogic: MonthLogic;

  constructor(
    private _year: string,
    private month: number,
    monthDates: number[],
    public daysFromPreviousMonthExists: boolean
  ) {
    super();
    this.monthLogic = new MonthLogic(this.month, _year, monthDates, daysFromPreviousMonthExists);
  }

  tryUpdate(dataRow: DataRow) {
    throw new Error("Method not implemented.");
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
  public get monthNumber() {
    return this.monthLogic.monthNumber;
  }
  public get dayCount() {
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

  public get dayNumbers(): number[] {
    return this.monthLogic.dates;
  }

  public get sectionData(): DataRow[] {
    return [new DataRow(this.translations.dates_key, this.dayNumbers)];
  }
}
