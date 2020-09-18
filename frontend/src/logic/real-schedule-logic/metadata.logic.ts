import { DayOfWeek } from "../../state/models/schedule-data/month-info.model";
import { DataRow } from "./data-row";
import { MonthLogic } from "./month.logic";

export class MetadataLogic {
  private translations = {
    dates_key: "Dni miesiąca",
  };

  private monthLogic;

  constructor(private _year: string, private month: number) {
    this.monthLogic = new MonthLogic(month, _year);
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

  public get dayNumbers(): number[] {
    return this.monthLogic.dates;
  }

  public get dayNumbersAsDataRow(): DataRow {
    return new DataRow(this.translations.dates_key, this.dayNumbers);
  }
}
