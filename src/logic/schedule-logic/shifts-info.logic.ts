import { DataRowHelper } from "../../helpers/data-row.helper";
import { WorkerType } from "../../common-models/worker-info.model";
import { ScheduleError } from "../../common-models/schedule-error.model";
import { ShiftCode, ShiftInfoModel } from "../../common-models/shift-info.model";
import { Sections } from "../providers/schedule-provider.model";
import { DataRow } from "./data-row";
import { BaseSectionLogic } from "./base-section-logic.model";
import { ShiftsProvider } from "../providers/shifts-provider.model";
import { MetadataLogic } from "./metadata.logic";
import { TranslationHelper } from "../../helpers/tranlsations.helper";
import { ShiftHelper } from "../../helpers/shifts.helper";

export class ShiftsInfoLogic extends BaseSectionLogic implements ShiftsProvider {
  get sectionKey(): keyof Sections {
    return this.workerType === WorkerType.NURSE ? "NurseInfo" : "BabysitterInfo";
  }

  private shifts: { [nurseName: string]: DataRow } = {};
  private _availableWorkersWorkTime: { [nurseName: string]: number } = {};
  private _scheduleErrors: ScheduleError[] = [];

  constructor(
    shiftSection: ShiftInfoModel = {},
    private workerType: WorkerType,
    private metadata: MetadataLogic
  ) {
    super();
    Object.keys(shiftSection).forEach((key) => {
      this.shifts[key] = new DataRow(key, shiftSection[key]);
    });
    this._availableWorkersWorkTime = this.mockWorkersWorkTime();
  }

  workerWorkTime(workerName: string): number {
    return this._availableWorkersWorkTime[workerName];
  }

  get availableWorkersWorkTime(): { [key: string]: number } {
    return this._availableWorkersWorkTime;
  }

  public calculateWorkerHourInfo(workerName: string) {
    const shifts = this.shifts[workerName].rowData(false, false) as ShiftCode[];
    const workerNorm = this._availableWorkersWorkTime[workerName];
    const verboseDate = this.metadata.verboseDates;
    const currentMonth = TranslationHelper.englishMonths[this.metadata.monthNumber];
    return ShiftHelper.caclulateWorkHoursInfo(shifts, workerNorm, verboseDate, currentMonth);
  }

  public get errors(): ScheduleError[] {
    return [...this._scheduleErrors];
  }

  public set errors(value: ScheduleError[]) {
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

  public get workers(): string[] {
    return Object.keys(this.shifts);
  }

  public get workerShifts(): { [nurseName: string]: ShiftCode[] } {
    return DataRowHelper.dataRowsAsValueDict<ShiftCode>(Object.values(this.shifts), false);
  }

  private mockWorkersWorkTime(): { [key: string]: number } {
    const workerDict = {};
    Object.keys(this.shifts).forEach((key) => (workerDict[key] = 1.0));
    return workerDict;
  }

  public tryUpdate(row: DataRow): boolean {
    if (Object.keys(this.shifts).includes(row.rowKey)) {
      this.shifts[row.rowKey] = row;
      return true;
    }
    return false;
  }

  public addWorker(worker: DataRow, workerWorkTime: number): DataRow[] {
    this._availableWorkersWorkTime[worker.rowKey] = workerWorkTime;
    return this.addDataRow(worker);
  }
}
