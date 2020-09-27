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

  constructor(headerRow: DataRowParser, private daysRow: DataRowParser) {
    let {
      no_metadata_info_msg,
      year_label,
      hour_amount_label,
      month_label,
    } = this.translations;
    if (headerRow) {
      [this.month, this._year, this.hours] = headerRow.findValues(
        month_label,
        year_label,
        hour_amount_label
      );
      this.monthLogic = new MonthLogic(this.month, this._year, daysRow.rowData(false, false).map(i => parseInt(i)).filter(i => i<=31), this.daysFromPreviousMonthExists);      
    } else {
      throw new Error(no_metadata_info_msg);
    }
  }

  public get daysFromPreviousMonthExists() {
    return this._daysFromPreviousMonthExists(this.daysRow)
  }
  
  public get dates() {
    return this.monthLogic.dates;
  }
  private _daysFromPreviousMonthExists(daysRow?: DataRowParser) {
    if (!daysRow) throw new Error(this.translations['no_metadata_info_msg']);
    let firstDayIndex = daysRow.rowData(true,false).map(parseInt).indexOf(1);
    return firstDayIndex != 0
  }

  public get frozenDays(): number[] {
    return this.monthLogic.verboseDates.filter(date => date.isFrozen).map(date => date.date - 1);
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
  public get validaDataStart() {
    return 0
  }

  /**
   * Counts from 0
   */
  public get validaDataEnd() {
    return this.monthLogic.dates.length - 1;
  }
}
