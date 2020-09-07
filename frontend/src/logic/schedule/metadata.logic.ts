import { DayOfWeek } from "../../state/models/schedule-data/month-info.model";
import { DataRow } from "./data-row.logic";
import { MonthLogic } from "./month.logic";

export class MetaDataLogic {
  private month: string;
  private hours: string;
  private _year: string;
  private monthLogic: MonthLogic;

  constructor(dataRow?: DataRow) {
    if (dataRow) {
      [this.month, this._year, this.hours] = dataRow.findValues("miesiąc", "rok", "ilość godz");
      this.monthLogic = new MonthLogic(this.month, this._year);
    } else {
      throw new Error("No metadata description provided");
    }
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
  /**
   * Counts from 0
   */
  public get firsMondayDate() {
    return this.monthLogic.dates[0] - 1;
  }

  /**
   * Counts from 0
   */
  public get lastSundayDate() {
    return this.monthLogic.dates[this.monthLogic.dayCount - 1] - 1;
  }
}
