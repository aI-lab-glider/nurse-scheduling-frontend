import { DataRowHelper } from "../../helpers/row.helper";
import { ScheduleErrorModel } from "../../state/models/schedule-data/schedule-error.model";
import { ShiftCode, ShiftInfoModel } from "../../state/models/schedule-data/shift-info.model";
import { ShiftsProvider } from "../schedule-provider";
import { DataRow } from "./data-row";
import { SectionLogic } from "./section-logic.model";

export class ShiftsInfoLogic implements SectionLogic, ShiftsProvider {
  private shifts: { [nurseName: string]: DataRow } = {};
  private _scheduleErrors: ScheduleErrorModel[] = [];

  constructor(shiftSection: ShiftInfoModel) {
    Object.keys(shiftSection).forEach((key) => {
      this.shifts[key] = new DataRow(key, shiftSection[key]);
    });
  }

  public get errors(): ScheduleErrorModel[] {
    return [...this._scheduleErrors];
  }

  public set errors(value: ScheduleErrorModel[]) {
    this._scheduleErrors = value;
  }

  public get sectionData(): DataRow[] {
    return Object.values(this.shifts);
  }

  public get workersCount(): number {
    return this.sectionData.length;
  }

  public getWorkerShifts(): { [nurseName: string]: ShiftCode[] } {
    return DataRowHelper.dataRowsAsValueDict<ShiftCode>(Object.values(this.shifts), false);
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
