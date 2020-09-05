import { SectionLogic } from "../../helpers/section.model";
import { Shift } from "../../state/models/schedule-data/shift-info.model";
import { DataRow } from "./data-row.logic";
import { MetaDataLogic } from "./metadata.logic";

export class ShiftsInfoLogic implements SectionLogic {
  //#region  members
  data: DataRow[];
  shifts: { [key: string]: Shift[] };

  constructor(scheduleInfoSection: DataRow[], metaData: MetaDataLogic) {
    this.data = scheduleInfoSection;
    this.shifts = scheduleInfoSection
      .map((row) => ({
        [row.key]: this.getShiftsFromRow(row, metaData),
      }))
      .reduce((prev, curr) => ({ ...prev, ...curr }));
  }

  //#endregion

  public get workersCount(): number {
    return Object.keys(this.shifts).length;
  }

  public asDict() {
    return { ...this.shifts };
  }

  //#region logic
  private getShiftsFromRow(row: DataRow, metaData: MetaDataLogic): Shift[] {
    let shifts: Shift[] = this.fillShiftsRow(
      row.data(true).slice(metaData.firsMondayDate, metaData.lastSundayDate + 1)
    );
    return shifts;
  }

  private fillShiftsRow(row: string[]): Shift[] {
    let previousShift: Shift = null;
    return row.map((i) => {
      if (i === null) {
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
