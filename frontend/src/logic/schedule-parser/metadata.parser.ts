import { WeekDay } from "../../state/models/schedule-data/month-info.model";
import { MonthLogic } from "../schedule-logic/month.logic";
import { MetadataProvider } from "../schedule-provider";
import { DataRowParser } from "./data-row.parser";

export class MetaDataParser implements MetadataProvider {
  //#region  translations
  private translations = {
    monthLabel: "miesiąc",
    yearLabel: "rok",
    hourAmountLabel: "ilość godz",
    datesKey:  "Dni miesiąca",
    noMetadataInfoMsg: "W harmonogramie nie podano danych o roku i miesiącu",
  };
  //#endregion

  private month: string;
  private hours: string;
  private _year: string;
  private monthLogic: MonthLogic;

  constructor(headerRow: DataRowParser, private daysRow: DataRowParser) {
    let { noMetadataInfoMsg, yearLabel, hourAmountLabel, monthLabel } = this.translations;
    if (headerRow) {
      [this.month, this._year, this.hours] = headerRow.findValues(
        monthLabel,
        yearLabel,
        hourAmountLabel
      );
      daysRow.rowKey = "monthDates";
      this.monthLogic = new MonthLogic(
        this.month,
        this._year,
        daysRow
          .rowData(false, false)
          .map((i) => parseInt(i))
          .filter((i) => i <= 31),
        this.daysFromPreviousMonthExists
      );
    } else {
      throw new Error(noMetadataInfoMsg);
    }
  }

  public get daysFromPreviousMonthExists() {
    return this._daysFromPreviousMonthExists(this.daysRow);
  }

  public get dates() {
    return this.monthLogic.dates;
  }
  private _daysFromPreviousMonthExists(daysRow?: DataRowParser) {
    if (!daysRow) throw new Error(this.translations["noMetadataInfoMsg"]);
    let firstDayIndex = daysRow.rowData(true, false).map(parseInt).indexOf(1);
    return firstDayIndex !== 0;
  }

  public get frozenDays(): [number, number][] {
    return this.monthLogic.verboseDates
      .filter((date) => date.isFrozen)
      .map((date, index) => [0, index + 1]);
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

  public get dayNumbers(): number[] {
    return this.monthLogic.dates;
  }

  public get dayNumbersAsDataRow(): DataRowParser {
    let { datesKey } = this.translations;
    let datesAsObject = this.monthLogic.dates.reduce(
      (storage, date, index) => {
        return { ...storage, [index + " "]: date };
      },
      { key: datesKey }
    );
    return new DataRowParser(datesAsObject);
  }
  /**
   * Counts from 0
   */
  public get validaDataStart() {
    return 0;
  }

  /**
   * Counts from 0
   */
  public get validaDataEnd() {
    return this.monthLogic.dates.length - 1;
  }
}
