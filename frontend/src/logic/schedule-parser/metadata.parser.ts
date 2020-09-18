import { DayOfWeek } from "../../state/models/schedule-data/month-info.model";
import { MonthLogic } from "../real-schedule-logic/month.logic";
import { DataRowParser } from "./data-row.parser";

export class MetaDataParser {
  //#region  translations
  private translations = {
    month_label: "miesiąc",
    year_label: "rok",
    hour_amount_label: "ilość godz",
    dates_key: "Dni miesiąca",
    no_metadata_info_msg: "W harmonogramie nie podano danych o roku i miesiącu",
  };
  //#endregion

  private month: string;
  private hours: string;
  private _year: string;
  private monthLogic: MonthLogic;

  constructor(dataRow?: DataRowParser) {
    let {
      no_metadata_info_msg,
      year_label,
      hour_amount_label,
      month_label,
      ..._
    } = this.translations;
    if (dataRow) {
      [this.month, this._year, this.hours] = dataRow.findValues(
        month_label,
        year_label,
        hour_amount_label
      );
      this.monthLogic = new MonthLogic(this.month, this._year);
    } else {
      throw new Error(no_metadata_info_msg);
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

  public get dayNumbersAsDataRow(): DataRowParser {
    let { dates_key, ..._ } = this.translations;
    let datesAsObject = this.monthLogic.dates.reduce(
      (storage, date, index) => {
        return { ...storage, [index + " "]: date };
      },
      { key: dates_key }
    );
    return new DataRowParser(datesAsObject);
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
