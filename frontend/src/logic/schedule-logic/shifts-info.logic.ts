import { DataRowHelper } from "../../helpers/data-row.helper";
import { WorkerType } from "../../state/models/schedule-data/worker-info.model";
import { ScheduleErrorModel } from "../../state/models/schedule-data/schedule-error.model";
import { ShiftCode, ShiftInfoModel } from "../../state/models/schedule-data/shift-info.model";
import { ShiftsProvider } from "../schedule-provider";
import { DataRow } from "./data-row";
import { BaseSectionLogic } from "./section-logic.model";

export class ShiftsInfoLogic extends BaseSectionLogic implements ShiftsProvider {
  sectionKey: string;
  private shifts: { [nurseName: string]: DataRow } = {};
  private _availableWorkersWorkTime: { [nurseName: string]: number } = {};
  private _scheduleErrors: ScheduleErrorModel[] = [];

  constructor(shiftSection: ShiftInfoModel, workerType: WorkerType) {
    super();
    Object.keys(shiftSection).forEach((key) => {
      this.shifts[key] = new DataRow(key, shiftSection[key]);
    });
    this.sectionKey = `${workerType}Section`;
    this._availableWorkersWorkTime = this.mockWorkersWorkTime();
  }

  workerWorkTime(workerName: string) {
    return this._availableWorkersWorkTime[workerName];
  }

  availableWorkersWorkTime(): { [key: string]: number } {
    return this._availableWorkersWorkTime;
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

  public set sectionData(dataRows: DataRow[]) {
    this.shifts = DataRowHelper.dataRowsAsDataRowDict<DataRow>(dataRows);
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

  private mockWorkersWorkTime(): { [key: string]: number } {
    let workerDict = {};
    Object.keys(this.shifts).forEach((key) => (workerDict[key] = 1.0));
    return workerDict;
  }

  public tryUpdate(row: DataRow) {
    if (Object.keys(this.shifts).includes(row.rowKey)) {
      this.shifts[row.rowKey] = row;
      return true;
    }
    return false;
  }

  public addWorker(worker: DataRow, workerWorkTime: number) {
    this._availableWorkersWorkTime[worker.rowKey] = workerWorkTime;
    return this.addDataRow(worker);
  }
}
