/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import PouchDB from "pouchdb-browser";
import {
  isMonthModelEmpty,
  MonthDataModel,
  ScheduleDataModel,
} from "../common-models/schedule-data.model";

import { ScheduleDataActionCreator } from "../state/reducers/month-state/schedule-data/schedule-data.action-creator";
import {
  MonthRevision,
  PersistenceStoreProvider,
  RevisionFilter,
  RevisionType,
  ThunkFunction,
} from "./persistance-store.model";

export const DATABASE_NAME = "nurse-scheduling";
export class LocalStorageProvider extends PersistenceStoreProvider {
  private storage: PouchDB.Database<MonthRevision>;

  constructor() {
    super();
    this.storage = new PouchDB(DATABASE_NAME);
  }

  saveMonthRevision(
    type: RevisionType,
    monthDataModel: MonthDataModel
  ): ThunkFunction<MonthDataModel> {
    return async (dispatch): Promise<void> => {
      if (isMonthModelEmpty(monthDataModel)) {
        return;
      }
      const id = monthDataModel.scheduleKey.key;
      let revision = "";
      try {
        const document = await this.storage.get(id);
        revision = document._rev;
      } catch {}
      this.storage.put({
        _rev: revision,
        _id: id,
        data: monthDataModel,
        revisionType: type,
      });
      const action = ScheduleDataActionCreator.setPersistentScheduleMonth(monthDataModel);
      dispatch(action);
    };
  }

  getMonthRevision(filter: RevisionFilter): ThunkFunction<ScheduleDataModel> {
    return async (dispatch): Promise<void> => {
      // eslint-disable-next-line @typescript-eslint/camelcase
      const revisions = await this.storage.allDocs({ include_docs: true });
      const result = revisions.rows.find((r) => {
        if (r.doc?.data.scheduleKey) {
          return (
            r.doc?.data.scheduleKey.key === filter.validityPeriod &&
            r.doc?.revisionType === filter.revisionType
          );
        } else {
          return undefined;
        }
      });
      if (!result?.doc) {
        return;
      }
      const action = ScheduleDataActionCreator.setPersistentScheduleMonth(result.doc.data);
      dispatch(action);
    };
  }
}
