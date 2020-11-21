import { ScheduleDataModel } from "../common-models/schedule-data.model";
import { ShiftInfoModel, ShiftModel } from "../common-models/shift-info.model";
import { WorkerInfoModel, WorkersInfoModel } from "../common-models/worker-info.model";
import { ScheduleDataActionType } from "../state/reducers/schedule-data.reducer";
import {
  PersistanceStoreProvider,
  RevisionFilter,
  ScheduleRevision,
  ThunkFunction,
  ScheduleKey,
  ScheduleRecord,
} from "./persistance-store.model";
/*eslint-disable @typescript-eslint/no-unused-vars*/

export class LocalStorageProvider implements PersistanceStoreProvider {
  private sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
  saveScheduleRevision(revision: ScheduleRevision): ThunkFunction<ScheduleDataModel> {
    return async (dispatch, getState): Promise<void> => {
      await this.sleep(100);
      const revisions = JSON.parse(localStorage.getItem("revisions") || "[]");
      localStorage.setItem("currentSchedule", JSON.stringify([...revisions, revision]));
      dispatch({
        type: ScheduleDataActionType.ADD_NEW,
        payload: revision.data,
      });
    };
  }
  getScheduleRevision(filter: RevisionFilter): ThunkFunction<ScheduleDataModel> {
    return async (dispatch, getState): Promise<void> => {
      await this.sleep(100);
      const revisions: ScheduleRecord[] = JSON.parse(localStorage.getItem("revisions") || "[]");
      const result = revisions.find(
        (r) =>
          r.validityPeriod.month === filter.validityPeriod.month &&
          r.validityPeriod.year === filter.validityPeriod.year
      );
      if (!result) {
        return;
      }

      dispatch({
        type: ScheduleDataActionType.ADD_NEW,
        payload:
          filter.revisionType === "primary"
            ? result.primaryRevision.data
            : result.actualRevision.data,
      });
    };
  }
  addNewWorker(worker: WorkerInfoModel): ThunkFunction<WorkerInfoModel> {
    return async (dispatch, getState): Promise<void> => {
      await this.sleep(100);
      const workers: WorkerInfoModel[] = JSON.parse(localStorage.getItem("workers") || "[]");
      localStorage.setItem("workers", JSON.stringify([...workers, worker]));
    };
  }
  getWorkers(period: ScheduleKey): ThunkFunction<WorkersInfoModel> {
    return async (dispatch, getState): Promise<void> => {
      await this.sleep(100);
      const workers: WorkerInfoModel[] = JSON.parse(localStorage.getItem("workers") || "[]");
      const workersInPeriod = workers;
    };
  }

  addNewShift(shift: ShiftModel): ThunkFunction<ShiftModel> {
    return async (dispatch, getState): Promise<void> => {
      await this.sleep(100);
      const shifts: ShiftInfoModel[] = JSON.parse(localStorage.getItem("shifts") || "[]");
      localStorage.setItem("shifts", JSON.stringify([...shifts, shift]));
    };
  }
  getShifts(period: ScheduleKey): ThunkFunction<ShiftModel> {
    return async (dispatch, getState): Promise<void> => {
      await this.sleep(100);
      const shifts: ShiftModel[] = JSON.parse(localStorage.getItem("shifts") || "[]");
      const shiftInPeriod = shifts;
    };
  }
}
