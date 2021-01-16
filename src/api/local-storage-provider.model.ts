/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import PouchDB from "pouchdb-browser";
import { isScheduleModelEmpty, ScheduleDataModel } from "../common-models/schedule-data.model";
import { ScheduleDataActionCreator } from "../state/reducers/month-state/schedule-data/schedule-data.action-creator";
import {
  PersistanceStoreProvider,
  RevisionFilter,
  RevisionType,
  ScheduleRevision,
  ThunkFunction,
} from "./persistance-store.model";

export const DATABASE_NAME = "nurse-scheduling";
/*eslint-disable @typescript-eslint/camelcase */
export class LocalStorageProvider extends PersistanceStoreProvider {
  private storage: PouchDB.Database<ScheduleRevision>;

  constructor() {
    super();
    this.storage = new PouchDB(DATABASE_NAME);
  }

  saveScheduleRevision(
    type: RevisionType,
    schedule: ScheduleDataModel
  ): ThunkFunction<ScheduleDataModel> {
    return async (dispatch): Promise<void> => {
      if (isScheduleModelEmpty(schedule)) {
        return;
      }
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
      const action = ScheduleDataActionCreator.setSchedule(schedule);
      dispatch(action);
    };
  }

  getScheduleRevision(filter: RevisionFilter): ThunkFunction<ScheduleDataModel> {
    return async (dispatch): Promise<void> => {
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
      const action = ScheduleDataActionCreator.setSchedule(result.doc.data);
      dispatch(action);
    };
  }
}
