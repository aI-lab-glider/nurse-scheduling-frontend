/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import PouchDB from "pouchdb-browser";
import {
  cropScheduleDMToMonthDM,
  getScheduleKey,
  isMonthModelEmpty,
  MonthDataModel,
  ScheduleDataModel,
} from "../common-models/schedule-data.model";

import {
  MonthRevision,
  PersistenceStoreProvider,
  RevisionFilter,
  RevisionType,
  ScheduleKey,
  UpdatePosition,
} from "./persistance-store.model";
import _ from "lodash";
import { calculateMissingFullWeekDays } from "../state/reducers/month-state/schedule-data/common-reducers";
import { ShiftInfoModel } from "../common-models/shift-info.model";

export const DATABASE_NAME = "nurse-scheduling";

export class LocalStorageProvider extends PersistenceStoreProvider {
  private storage: PouchDB.Database<MonthRevision>;

  constructor() {
    super();
    this.storage = new PouchDB(DATABASE_NAME);
  }

  async saveMonthRevision(type: RevisionType, monthDataModel: MonthDataModel): Promise<void> {
    if (isMonthModelEmpty(monthDataModel)) {
      return;
    }
    const id = monthDataModel.scheduleKey.dbKey;
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
  }

  async saveSchedule(type: RevisionType, scheduleDataModel: ScheduleDataModel): Promise<void> {
    const monthDataModel = cropScheduleDMToMonthDM(scheduleDataModel);
    await this.saveMonthRevision(type, monthDataModel);
    const [missingFromPrev] = calculateMissingFullWeekDays(monthDataModel.scheduleKey);
    const lastMonthDayIdx = _.findLast(scheduleDataModel.month_info.dates, (day) => day === 1);

    const prevMonthShifts = {};
    Object.keys(scheduleDataModel.shifts).forEach((key) => {
      prevMonthShifts[key] = scheduleDataModel.shifts[key].slice(0, missingFromPrev);
    });
    if (!_.isEmpty(prevMonthShifts)) {
      await this.updateMonthRevision(
        type,
        getScheduleKey(scheduleDataModel).prevMonthKey,
        prevMonthShifts,
        "TAIL"
      );
    }

    const nextMonthShifts = {};
    Object.keys(scheduleDataModel.shifts).forEach((key) => {
      nextMonthShifts[key] = scheduleDataModel.shifts[key].slice(lastMonthDayIdx);
    });
    if (!_.isEmpty(nextMonthShifts)) {
      await this.updateMonthRevision(
        type,
        getScheduleKey(scheduleDataModel).nextMonthKey,
        nextMonthShifts,
        "HEAD"
      );
    }
  }

  async updateMonthRevision(
    type: RevisionType,
    monthKey: ScheduleKey,
    updateShifts: ShiftInfoModel,
    updatePosition: UpdatePosition
  ): Promise<void> {
    try {
      const document = await this.storage.get(monthKey.dbKey);
      const revision = document._rev;

      const newShifts = _.cloneDeep(document.data.shifts);

      Object.keys(document.data.shifts).forEach((key) => {
        if (updatePosition === "TAIL") {
          newShifts[key].splice(0, updateShifts[key].length, ...updateShifts[key]);
        } else {
          newShifts[key].splice(
            newShifts[key].length - updateShifts[key].length,
            newShifts[key].length,
            ...updateShifts[key]
          );
        }
      });
      document.data.shifts = newShifts;
      this.storage.put({
        _rev: revision,
        _id: monthKey.dbKey,
        data: document.data,
        revisionType: type,
      });
    } catch {
      //TODO: Something should be done here :)
    }
  }

  async getMonthRevision(filter: RevisionFilter): Promise<MonthDataModel | undefined> {
    // eslint-disable-next-line @typescript-eslint/camelcase
    const revisions = await this.storage.allDocs({ include_docs: true });
    const result = revisions.rows.find((r) => {
      if (r.doc?.data.scheduleKey) {
        return r.id === filter.validityPeriod && r.doc?.revisionType === filter.revisionType;
      } else {
        return undefined;
      }
    });
    if (!result?.doc) {
      return undefined;
    }

    return result.doc.data;
  }
}
