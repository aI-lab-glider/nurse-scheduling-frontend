import { WeekDay } from "../../common-models/month-info.model";
import { MonthInfoLogic } from "../schedule-logic/month-info.logic";
import { MetadataProvider } from "../schedule-provider";
import { DataRowParser } from "./data-row.parser";
import { MetaDataSectionKey } from "../section.model";

export class MetaDataParser implements MetadataProvider {
  private monthLogic: MonthInfoLogic;

  constructor(headerRow: DataRowParser, private daysRow: DataRowParser) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [month, year, hours] = headerRow.findValues(
      MetaDataSectionKey.Month,
      MetaDataSectionKey.Year,
      MetaDataSectionKey.RequiredavailableWorkersWorkTime
    );
    daysRow.rowKey = MetaDataSectionKey.MonthDays;
    this.monthLogic = new MonthInfoLogic(
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

  public get daysFromPreviousMonthExists(): boolean {
    return this._daysFromPreviousMonthExists(this.daysRow);
  }

  public get dates(): number[] {
    return this.monthLogic.dates;
  }
  private _daysFromPreviousMonthExists(daysRow?: DataRowParser): boolean {
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

  public get monthNumber(): number {
    return this.monthLogic.monthNumber;
  }

  public get dayCount(): number {
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

  public get validDataStart(): number {
    return 0;
  }

  public get validDataEnd(): number {
    return this.monthLogic.dates.length - 1;
  }
}
