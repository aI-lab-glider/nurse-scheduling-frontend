/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import { ScheduleError } from "../../common-models/schedule-error.model";
import { ShiftCode, ShiftInfoModel } from "../../common-models/shift-info.model";
import { WorkerType } from "../../common-models/worker-info.model";
import { ArrayHelper } from "../../helpers/array.helper";
import { DataRowHelper } from "../../helpers/data-row.helper";
import { Sections } from "../providers/schedule-provider.model";
import { ShiftsProvider } from "../providers/shifts-provider.model";
import { BaseSectionLogic } from "./base-section-logic.model";
import { DataRow } from "./data-row";
import { MetadataLogic } from "./metadata.logic";

export class ShiftsInfoLogic extends BaseSectionLogic implements ShiftsProvider {
  get sectionKey(): keyof Sections {
    return this.workerType === WorkerType.NURSE ? "NurseInfo" : "BabysitterInfo";
  }

  private _availableWorkersWorkTime: { [nurseName: string]: number } = {};
  private _scheduleErrors: ScheduleError[] = [];

  constructor(
    shiftSection: ShiftInfoModel = {},
    private workerType: WorkerType,
    private metadata: MetadataLogic
  ) {
    super(Object.keys(shiftSection).map((key) => new DataRow(key, shiftSection[key])));
    this._availableWorkersWorkTime = this.mockWorkersWorkTime();
  }

  workerWorkTime(workerName: string): number {
    return this._availableWorkersWorkTime[workerName];
  }

  get availableWorkersWorkTime(): { [key: string]: number } {
    return this._availableWorkersWorkTime;
  }

  public get errors(): ScheduleError[] {
    return [...this._scheduleErrors];
  }

  public set errors(value: ScheduleError[]) {
    this._scheduleErrors = value;
  }

  private get shifts(): { [key: string]: DataRow } {
    return ArrayHelper.arrayToObject(
      this.sectionData,
      (row) => row.rowKey,
      (key, row) => row
    );
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
