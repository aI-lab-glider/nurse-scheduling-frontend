import { ActionModel } from "../../state/models/action.model";
import { DayOfWeek } from "../../state/models/schedule-data/month-info.model";
import { DataRow } from "./data-row";
import { MonthLogic, VerboseDate } from "./month.logic";
import { SectionLogic } from "./section-logic.model";
export enum MonthLogicActionType {
  UpdateFrozenDates = "updateFrozenDates",
}

export class MetadataLogic implements SectionLogic {
  private translations = {
    dates_key: "Dni miesiąca",
  };

  public changeShiftFrozenState(
    nurse: string,
    index: number,
    isFrozen: boolean
  ): ActionModel<[number | string, number][]> {
    let frozenDates = this.frozenDates;
    if (isFrozen) {
      frozenDates.push([nurse, index]);
    } else {
      let ind = frozenDates.indexOf([nurse, index]);
      if (ind != -1) {
        delete frozenDates[ind];
      }
    }

    return {
      type: MonthLogicActionType.UpdateFrozenDates,
      payload: frozenDates,
    };
  }

  private monthLogic: MonthLogic;

  constructor(
    private _year: string,
    private month: number,
    monthDates: number[],
    public daysFromPreviousMonthExists: boolean
  ) {
    this.monthLogic = new MonthLogic(this.month, _year, monthDates, daysFromPreviousMonthExists);
  }

  tryUpdate(dataRow: DataRow) {
    throw new Error("Method not implemented.");
  }

  public get verboseDates(): VerboseDate[] {
    return this.monthLogic.verboseDates;
  }

  public get frozenDates(): [string | number, number][] {
    return this.verboseDates.filter((date) => date.isFrozen).map((date, index) => [0, index + 1]);
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

  public get daysOfWeek(): DayOfWeek[] {
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
