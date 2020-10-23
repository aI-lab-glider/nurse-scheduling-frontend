import { WeekDay } from "../../state/models/schedule-data/month-info.model";
import { MonthLogic } from "../schedule-logic/month.logic";
import { MetadataProvider } from "../schedule-provider";
import { DataRowParser } from "./data-row.parser";
import { MetaDataSectionKey } from "../models/metadata-section.model";

export class MetaDataParser implements MetadataProvider {
  private monthLogic: MonthLogic;

  constructor(headerRow: DataRowParser, private daysRow: DataRowParser) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [month, year, hours] = headerRow.findValues(
      MetaDataSectionKey.Month,
      MetaDataSectionKey.Year,
      MetaDataSectionKey.RequiredavailableWorkersWorkTime
    );
    daysRow.rowKey = MetaDataSectionKey.MonthDays;
    this.monthLogic = new MonthLogic(
      month,
      year,
      this.extractDates(daysRow),
      this.daysFromPreviousMonthExists
    );
  }

  private extractDates(dataRowParser: DataRowParser): number[] {
    return dataRowParser
      .rowData(false, false)
      .map((i) => parseInt(i))
      .filter((i) => i <= 31);
  }

  public get daysFromPreviousMonthExists() {
    return this._daysFromPreviousMonthExists(this.daysRow);
  }

  public get dates() {
    return this.monthLogic.dates;
  }
  private _daysFromPreviousMonthExists(daysRow?: DataRowParser) {
    if (!daysRow) {
      // TODO implement logger
      return false;
    }
    const firstDayIndex = daysRow.rowData(true, false).map(parseInt).indexOf(1);
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
    return parseInt(this.monthLogic.year);
  }

  public get daysOfWeek(): WeekDay[] {
    return this.monthLogic.daysOfWeek;
  }

  public get dayNumbers(): number[] {
    return this.monthLogic.dates;
  }

  public get dayNumbersAsDataRow(): DataRowParser {
    const datesAsObject = this.monthLogic.dates.reduce(
      (storage, date, index) => {
        return { ...storage, [index + " "]: date };
      },
      { key: MetaDataSectionKey.MonthDays }
    );
    return new DataRowParser(datesAsObject);
  }

  public get validDataStart() {
    return 0;
  }

  public get validDataEnd() {
    return this.monthLogic.dates.length - 1;
  }
}
