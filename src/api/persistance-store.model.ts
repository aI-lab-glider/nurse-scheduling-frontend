/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import { ThunkDispatch } from "redux-thunk";
import { MonthDataModel, ScheduleDataModel } from "../common-models/schedule-data.model";
import { WorkerInfoModel } from "../common-models/worker-info.model";
import { ActionModel } from "../state/models/action.model";
import { ApplicationStateModel } from "../state/models/application-state.model";
import { ArrayPositionPointer } from "../helpers/array.helper";

export type ThunkFunction<T> = (
  dispatch: ThunkDispatch<ApplicationStateModel, void, ActionModel<T>>,
  getState: () => ApplicationStateModel
) => Promise<unknown> | unknown;

export type ScheduleKeyString = string;
type BorderMonthOfYear = 0 | 11;
type YearOffset = -1 | 1;

export class ScheduleKey {
  constructor(public month: number, public year: number) {}

  get dbKey(): ScheduleKeyString {
    return `${this.month}_${this.year}`;
  }

  get nextMonthKey(): ScheduleKey {
    return this.getMonthNeighbour(11, 1);
  }

  get prevMonthKey(): ScheduleKey {
    return this.getMonthNeighbour(0, -1);
  }

  private getMonthNeighbour(
    yearBorderMonth: BorderMonthOfYear,
    yearOffset: YearOffset
  ): ScheduleKey {
    const isYearBorderMonth = this.month === yearBorderMonth;
    const month = isYearBorderMonth ? 11 - yearBorderMonth : this.month + yearOffset;
    const year = isYearBorderMonth ? this.year + yearOffset : this.year;
    return new ScheduleKey(month, year);
  }
}

export type RevisionType = "primary" | "actual";

export interface RevisionFilter {
  revisionType: RevisionType;
  validityPeriod: ScheduleKeyString;
}

export interface MonthRevision {
  _id: string;
  revisionType: RevisionType;
  data: MonthDataModel;
}

export interface MonthRecord {
  primaryRevision: MonthRevision;
  actualRevision: MonthRevision;
  validityPeriod: ScheduleKeyString;
  workersInfo: WorkerInfoModel[];
}

export abstract class PersistenceStoreProvider {
  abstract async saveMonthRevision(
    type: RevisionType,
    monthDataModel: MonthDataModel
  ): Promise<void>;
  abstract async getMonthRevision(filter: RevisionFilter): Promise<MonthDataModel | undefined>;
  abstract async saveSchedule(
    type: RevisionType,
    scheduleDataModel: ScheduleDataModel
  ): Promise<void>;

  abstract async updateMonthPartBasedOnScheduleDM(
    type: RevisionType,
    monthKey: ScheduleKey,
    scheduleDataModel: ScheduleDataModel,
    missingDays: number,
    updatePosition: ArrayPositionPointer
  ): Promise<void>;
}
