/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import { ThunkDispatch } from "redux-thunk";
import { ScheduleDataModel } from "../common-models/schedule-data.model";
import { WorkerInfoModel } from "../common-models/worker-info.model";
import { ActionModel } from "../state/models/action.model";
import { ApplicationStateModel } from "../state/models/application-state.model";

/*eslint-disable @typescript-eslint/camelcase */

export type ThunkFunction<T> = (
  dispatch: ThunkDispatch<ApplicationStateModel, void, ActionModel<T>>,
  getState: () => ApplicationStateModel
) => Promise<unknown> | unknown;

export interface ScheduleKey {
  month: number;
  year: number;
}

export type RevisionType = "primary" | "actual";
export interface RevisionFilter {
  revisionType: RevisionType;
  validityPeriod: ScheduleKey;
}

export interface ScheduleRevision {
  _id: string;
  revisionType: RevisionType;
  data: ScheduleDataModel;
}

export interface ScheduleRecord {
  primaryRevision: ScheduleRevision;
  actualRevision: ScheduleRevision;
  validityPeriod: ScheduleKey;
  workersInfo: WorkerInfoModel[];
}
export abstract class PersistanceStoreProvider {
  abstract saveScheduleRevision(
    type: RevisionType,
    schedule: ScheduleDataModel
  ): ThunkFunction<ScheduleDataModel>;
  abstract getScheduleRevision(filter: RevisionFilter): ThunkFunction<ScheduleDataModel>;
  protected getScheduleId(schedule: ScheduleDataModel): string {
    const { month_number, year } = schedule.schedule_info;
    return `${month_number}_${year}`;
  }
}
