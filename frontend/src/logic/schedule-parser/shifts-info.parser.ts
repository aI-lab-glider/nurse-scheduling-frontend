import { Shift } from "../../state/models/schedule-data/shift-info.model";
import { DataRowParser } from "./data-row.parser";
import { MetaDataParser } from "./metadata.parser";

export class ShiftsInfoParser {
  //#region  members
  private rowByKeys: { [key: string]: DataRowParser } = {};

  constructor(scheduleInfoSection: DataRowParser[], private metaData: MetaDataParser) {
    let data = scheduleInfoSection.map((row) => {
      row.processRow(this.fillRowWithShifts);
      // lastSundayData + 1 because slice not include last index
      row.cropData(this.metaData.validaDataStart, this.metaData.validaDataEnd + 1);
      return row;
    });
    data.forEach((row) => {
      this.rowByKeys[row.rowKey] = row;
    });
  }

  //#endregion
  //#region logic
  public get sectionData(): DataRowParser[] {
    return this.data;
  }

  public get workersCount(): number {
    return this.data.length;
  }

  public get data() {
    return Object.values(this.rowByKeys);
  }

  public getWorkerShifts(): { [workerName: string]: Shift[] } {
    return this.data
      .map((row) => ({
        [row.rowKey]: this.fillRowWithShifts(row.rowData(true)),
      }))
      .reduce((prev, curr) => ({ ...prev, ...curr }));
  }

  //#endregion

  //#region parser

  private fillRowWithShifts(row: string[]): Shift[] {
    let previousShift: Shift = null;
    return row.map((i) => {
      if (typeof i == "number") {
        return i;
      }
      if (i === null || i === "*") {
        return previousShift || "W";
      }
      switch (i.trim().slice(0, 2).trim()) {
        case "L4":
          previousShift = previousShift === "L4" ? null : "L4";
          break;
        case "U":
          previousShift = previousShift === "U" ? null : "U";
          break;
        default:
          previousShift = null;
          break;
      }
      return previousShift || (i?.trim().slice(0, 2).trim() as Shift);
    });
  }
  //#endregion
}
