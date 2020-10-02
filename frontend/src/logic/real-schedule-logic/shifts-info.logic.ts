import { DataRowHelper } from "../../helpers/row.helper";
import { Shift, ShiftInfoModel } from "../../state/models/schedule-data/shift-info.model";
import { DataRow } from "./data-row";
import { SectionLogic } from "./section-logic.model";

export class ShiftsInfoLogic implements SectionLogic {
  private shifts: { [nurseName: string]: DataRow } = {};

  constructor(shiftSection: ShiftInfoModel) {
    Object.keys(shiftSection).forEach((key) => {
      this.shifts[key] = new DataRow(key, shiftSection[key]);
    });
  }

  public get sectionData(): DataRow[] {
    return Object.values(this.shifts);
  }

  public get workersCount(): number {
    return this.sectionData.length;
  }

  public getWorkerShifts(): { [nurseName: string]: Shift[] } {
    return DataRowHelper.dataRowsAsValueDict<Shift>(Object.values(this.shifts), false);
  }

  public getWorkers(): string[] {
    return Object.keys(this.shifts);
  }
  public mockEmployeeWorkTime(): { [key: string]: number } {
    let employeeDict = {};
    Object.keys(this.shifts).forEach((key) => (employeeDict[key] = 1.0));
    return employeeDict;
  }

  public tryUpdate(row: DataRow) {
    if (Object.keys(this.shifts).includes(row.rowKey)) {
      this.shifts[row.rowKey] = row;
      return true;
    }
    return false;
  }
}
