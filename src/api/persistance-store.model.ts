import { Dispatch } from "react";
import { ScheduleDataModel } from "../common-models/schedule-data.model";
import { ShiftModel } from "../common-models/shift-info.model";
import { WorkerInfoModel, WorkersInfoModel } from "../common-models/worker-info.model";
import { ActionModel } from "../state/models/action.model";
import { ApplicationStateModel } from "../state/models/application-state.model";

export type ThunkFunction<T> = (
  dispatch: Dispatch<ActionModel<T>>,
  getState: () => ApplicationStateModel
) => Promise<unknown>;

export interface ScheduleKey {
  month: number;
  year: number;
}

type RevisionType = "primary" | "actual";
export interface RevisionFilter {
  revisionType: RevisionType;
  validityPeriod: ScheduleKey;
}

export interface ScheduleRevision {
  revisionType: RevisionType;
  data: ScheduleDataModel;
}

export interface ScheduleRecord {
  primaryRevision: ScheduleRevision;
  actualRevision: ScheduleRevision;
  validityPeriod: ScheduleKey;
  workersInfo: WorkerInfoModel[];
}
export interface PersistanceStoreProvider {
  saveScheduleRevision(schedule: ScheduleRevision): ThunkFunction<ScheduleDataModel>;
  getScheduleRevision(filter: RevisionFilter): ThunkFunction<ScheduleDataModel>;
  addNewWorker(worker: WorkerInfoModel): ThunkFunction<WorkerInfoModel>;
  getWorkers(period: ScheduleKey): ThunkFunction<WorkersInfoModel>;
  addNewShift(shift: ShiftModel): ThunkFunction<ShiftModel>;
  getShifts(period: ScheduleKey): ThunkFunction<ShiftModel>;
}
