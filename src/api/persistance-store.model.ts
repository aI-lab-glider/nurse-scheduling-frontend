import SelectInput from "@material-ui/core/Select/SelectInput";
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

export interface TimeUnit {
  month: number;
  year: number;
}

export interface RevisionDescription {
  validityPeriod: TimeUnit;
  revisionType: "primary" | "actual";
}

export interface ScheduleRevision extends RevisionDescription {
  data: ScheduleDataModel;
}

export interface PersistanceStoreProvider {
  saveScheduleRevision(schedule: ScheduleRevision): ThunkFunction<ScheduleDataModel>;
  getScheduleRevision(revision: RevisionDescription): ThunkFunction<ScheduleDataModel>;
  addNewWorker(worker: WorkerInfoModel): ThunkFunction<WorkerInfoModel>;
  getWorkers(period: TimeUnit): ThunkFunction<WorkersInfoModel>;
  addNewShift(shift: ShiftModel): ThunkFunction<ShiftModel>;
  getShifts(period: TimeUnit): ThunkFunction<ShiftModel>;
}
