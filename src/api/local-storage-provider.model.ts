/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */

/* eslint-disable @typescript-eslint/camelcase */

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
} from "./persistance-store.model";
import _ from "lodash";
import { calculateMissingFullWeekDays } from "../state/reducers/month-state/schedule-data/common-reducers";
import { ArrayHelper, ArrayPositionPointer } from "../helpers/array.helper";

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
    const [missingFromPrev, missingFromNext] = calculateMissingFullWeekDays(
      monthDataModel.scheduleKey
    );
    if (missingFromPrev !== 0) {
      await this.updateMonthPartBasedOnScheduleDM(
        type,
        getScheduleKey(scheduleDataModel).prevMonthKey,
        scheduleDataModel,
        missingFromPrev,
        "TAIL"
      );
    }

    if (missingFromNext !== 0) {
      await this.updateMonthPartBasedOnScheduleDM(
        type,
        getScheduleKey(scheduleDataModel).nextMonthKey,
        scheduleDataModel,
        missingFromNext,
        "HEAD"
      );
    }
  }

  async updateMonthPartBasedOnScheduleDM(
    type: RevisionType,
    monthKey: ScheduleKey,
    scheduleDataModel: ScheduleDataModel,
    missingDays: number,
    updatePosition: ArrayPositionPointer
  ): Promise<void> {
    try {
      const document = await this.storage.get(monthKey.dbKey);
      const updatedMonthDataModel = document.data;
      const revision = document._rev;

      const newShifts = _.cloneDeep(updatedMonthDataModel.shifts);

      Object.keys(updatedMonthDataModel.shifts).forEach((key) => {
        newShifts[key] = ArrayHelper.update(
          updatedMonthDataModel.shifts[key],
          updatePosition,
          scheduleDataModel.shifts[key],
          missingDays
        );
      });

      updatedMonthDataModel.shifts = newShifts;
      updatedMonthDataModel.month_info = {
        ...updatedMonthDataModel.month_info,
        children_number: ArrayHelper.update(
          updatedMonthDataModel.month_info.children_number ?? [],
          updatePosition,
          scheduleDataModel.month_info.children_number ?? [],
          missingDays
        ),
        extra_workers: ArrayHelper.update(
          updatedMonthDataModel.month_info.extra_workers ?? [],
          updatePosition,
          scheduleDataModel.month_info.extra_workers ?? [],
          missingDays
        ),
      };

      this.storage.put({
        _rev: revision,
        _id: monthKey.dbKey,
        data: updatedMonthDataModel,
        revisionType: type,
      });
    } catch {
      //TODO: Something should be done here :)
    }
  }
  async getMonthRevision(filter: RevisionFilter): Promise<MonthDataModel | undefined> {
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
