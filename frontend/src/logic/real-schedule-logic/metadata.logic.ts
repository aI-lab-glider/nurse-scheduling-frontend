import { DayOfWeek } from "../../state/models/schedule-data/month-info.model";
import { DataRow } from "./data-row";
import { DateType, MonthLogic } from "./month.logic";
import { SectionLogic } from "./section-logic.model";

export interface VerboseDate extends DateType {}

export class MetadataLogic implements SectionLogic {
  private translations = {
    dates_key: "Dni miesiąca",
  };

  private monthLogic;

  constructor(private _year: string, private month: number) {
    this.monthLogic = new MonthLogic(month, _year);
  }

  tryUpdate(dataRow: DataRow) {
    throw new Error("Method not implemented.");
  }

  public get verboseDates(): VerboseDate[] {
    return this.monthLogic.dateTypes;
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

  public get sectionData(): DataRow[] {
    return [new DataRow(this.translations.dates_key, this.dayNumbers)];
  }
}
