import { SectionLogic } from "../../helpers/section.model";
import { Shift } from "../../state/models/schedule-data/shift-info.model";
import { DataRow } from "./data-row.logic";
import { MetaDataLogic } from "./metadata.logic";

export class ShiftsInfoLogic implements SectionLogic {
  //#region  members
  private rowByKeys: { [key: string]: DataRow } = {};

  constructor(scheduleInfoSection: DataRow[], private metaData: MetaDataLogic) {
    let data = scheduleInfoSection.map((row) => {
      row.updateData(this.fillRowWithShifts);
      row.cropData(this.metaData.firsMondayDate, this.metaData.lastSundayDate + 1);
      return row;
    });
    data.forEach((row) => {
      this.rowByKeys[row.rowKey] = row;
    });
  }

  //#endregion
  public get sectionData(): DataRow[] {
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

  //#region logic
  public tryUpdate(row: DataRow) {
    if (Object.keys(this.rowByKeys).includes(row.rowKey)) {
      this.rowByKeys[row.rowKey] = row;
    }
  }

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
