import { Dispatch } from "react";
import { ScheduleDataModel } from "../common-models/schedule-data.model";
import { ShiftModel } from "../common-models/shift-info.model";
import { WorkerInfoModel, WorkersInfoModel } from "../common-models/worker-info.model";
import { ActionModel } from "../state/models/action.model";
import { ApplicationStateModel } from "../state/models/application-state.model";

/*eslint-disable @typescript-eslint/camelcase */

export type ThunkFunction<T> = (
  dispatch: Dispatch<ActionModel<T>>,
  getState: () => ApplicationStateModel
) => Promise<unknown>;

export interface ScheduleKey {
  month: number;
  year: number;
}

export type RevisionType = "primary" | "actual";
export interface RevisionFilter {
  revisionType: RevisionType;
  validityPeriod: ScheduleKey;
}

export interface ScheduleRevision {
  _id: string;
  revisionType: RevisionType;
  data: ScheduleDataModel;
}

export interface ScheduleRecord {
  primaryRevision: ScheduleRevision;
  actualRevision: ScheduleRevision;
  validityPeriod: ScheduleKey;
  workersInfo: WorkerInfoModel[];
}
export abstract class PersistanceStoreProvider {
  abstract saveScheduleRevision(
    type: RevisionType,
    schedule: ScheduleDataModel
  ): ThunkFunction<ScheduleDataModel>;
  abstract getScheduleRevision(filter: RevisionFilter): ThunkFunction<ScheduleDataModel>;
  abstract addNewWorker(worker: WorkerInfoModel): ThunkFunction<WorkerInfoModel>;
  abstract getWorkers(period: ScheduleKey): ThunkFunction<WorkersInfoModel>;
  abstract addNewShift(shift: ShiftModel): ThunkFunction<ShiftModel>;
  abstract getShifts(period: ScheduleKey): ThunkFunction<ShiftModel>;
  protected getScheduleId(schedule: ScheduleDataModel): string {
    const { month_number, year } = schedule.schedule_info;
    return `${month_number}_${year}`;
  }
}
