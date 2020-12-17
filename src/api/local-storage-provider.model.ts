import { ScheduleDataModel } from "../common-models/schedule-data.model";
import { ShiftModel } from "../common-models/shift-info.model";
import { WorkerInfoModel, WorkersInfoModel } from "../common-models/worker-info.model";
import { ScheduleDataActionType } from "../state/reducers/schedule-data.reducer";
import {
  PersistanceStoreProvider,
  RevisionFilter,
  ScheduleRevision,
  ThunkFunction,
  ScheduleKey,
  RevisionType,
} from "./persistance-store.model";
import PouchDB from "pouchdb-browser";

/*eslint-disable @typescript-eslint/camelcase */
export class LocalStorageProvider extends PersistanceStoreProvider {
  private storage: PouchDB.Database<ScheduleRevision>;

  constructor() {
    super();
    this.storage = new PouchDB("nurse-scheduling");
  }

  saveScheduleRevision(
    type: RevisionType,
    schedule: ScheduleDataModel
  ): ThunkFunction<ScheduleDataModel> {
    return async (dispatch, getState): Promise<void> => {
      const id = this.getScheduleId(schedule);
      let revision = "";
      try {
        const document = await this.storage.get(id);
        revision = document._rev;
      } catch {}
      this.storage.put({
        _rev: revision,
        _id: id,
        data: schedule,
        revisionType: type,
      });
      dispatch({
        type: ScheduleDataActionType.ADD_NEW,
        payload: schedule,
      });
    };
  }

  getScheduleRevision(filter: RevisionFilter): ThunkFunction<ScheduleDataModel> {
    return async (dispatch, getState): Promise<void> => {
      const revisions = await this.storage.allDocs({ include_docs: true });
      const result = revisions.rows.find((r) => {
        const { year, month_number } = r.doc?.data.schedule_info ?? {};
        return (
          month_number === filter.validityPeriod.month &&
          year === filter.validityPeriod.year &&
          r.doc?.revisionType === filter.revisionType
        );
      });
      if (!result?.doc) {
        return;
      }
      dispatch({
        type: ScheduleDataActionType.ADD_NEW,
        payload: result.doc.data,
      });
    };
  }
  addNewWorker(worker: WorkerInfoModel): ThunkFunction<WorkerInfoModel> {
    throw Error("Not implemented method");
  }
  getWorkers(period: ScheduleKey): ThunkFunction<WorkersInfoModel> {
    throw Error("Not implemented method");
  }

  addNewShift(shift: ShiftModel): ThunkFunction<ShiftModel> {
    throw Error("Not implemented method");
  }
  getShifts(period: ScheduleKey): ThunkFunction<ShiftModel> {
    throw Error("Not implemented method");
  }
}
