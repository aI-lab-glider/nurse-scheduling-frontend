import { ScheduleDataModel } from "../common-models/schedule-data.model";
import { ShiftInfoModel, ShiftModel } from "../common-models/shift-info.model";
import { WorkerInfoModel, WorkersInfoModel } from "../common-models/worker-info.model";
import { ScheduleDataActionType } from "../state/reducers/schedule-data.reducer";
import {
  PersistanceStoreProvider,
  RevisionDescription,
  ScheduleRevision,
  ThunkFunction,
  TimeUnit,
} from "./persistance-store.model";

export class LocalStorageProvider implements PersistanceStoreProvider {
  private sleep(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
  saveScheduleRevision(revision: ScheduleRevision): ThunkFunction<ScheduleDataModel> {
    return async (dispatch, getState) => {
      this.sleep(2000);
      const revisions = JSON.parse(localStorage.getItem("revisions") || "[]");
      localStorage.setItem("currentSchedule", JSON.stringify([...revisions, revision]));
      dispatch({
        type: ScheduleDataActionType.ADD_NEW,
        payload: revision.data,
      });
    };
  }
  getScheduleRevision(target: RevisionDescription): ThunkFunction<ScheduleDataModel> {
    return async (dispatch, getState) => {
      this.sleep(2000);
      const revisions: ScheduleRevision[] = JSON.parse(localStorage.getItem("revisions") || "[]");
      const result = revisions.find(
        (r) => r.revisionType === target.revisionType && r.validityPeriod === target.validityPeriod
      );
      if (!result) {
        return;
      }
      dispatch({
        type: ScheduleDataActionType.ADD_NEW,
        payload: result.data,
      });
    };
  }
  addNewWorker(worker: WorkerInfoModel): ThunkFunction<WorkerInfoModel> {
    return async (dispatch, getState) => {
      this.sleep(2000);
      const workers: WorkerInfoModel[] = JSON.parse(localStorage.getItem("workers") || "[]");
      localStorage.setItem("workers", JSON.stringify([...workers, worker]));
    };
  }
  getWorkers(period: TimeUnit): ThunkFunction<WorkersInfoModel> {
    return async (dispatch, getState) => {
      const workers: WorkerInfoModel[] = JSON.parse(localStorage.getItem("workers") || "[]");
      const workersInPeriod = workers.filter(
        (w) => w.startWorking?.month! < period.month && w.stopWorking?.year! < period.year
      );
    };
  }

  addNewShift(shift: ShiftModel): ThunkFunction<ShiftModel> {
    return async (dispatch, getState) => {
      this.sleep(2000);
      const shifts: ShiftInfoModel[] = JSON.parse(localStorage.getItem("shifts") || "[]");
      localStorage.setItem("shifts", JSON.stringify([...shifts, shift]));
    };
  }
  getShifts(period: TimeUnit): ThunkFunction<ShiftModel> {
    return async (dispatch, getState) => {
      this.sleep(2000);
      const shifts: ShiftModel[] = JSON.parse(localStorage.getItem("shifts") || "[]");
      const shiftInPeriod = shifts.filter(
        (s) => s.validityPeriod?.month! === period.month && s.validityPeriod?.year! === period.year
      );
    };
  }
}
