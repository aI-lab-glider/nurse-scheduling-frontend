/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import { StateWithHistory } from "redux-undo";
import { RevisionType } from "../../api/persistance-store.model";
import { MonthDataModel, ScheduleDataModel } from "../../common-models/schedule-data.model";
import { GroupedScheduleErrors } from "../../common-models/schedule-error.model";
import { Opaque } from "../../common-models/type-utils";
import { ScheduleMode } from "../../components/schedule-page/table/schedule/use-schedule-state";

export type BaseMonthRevisionDataModel = Opaque<"BaseScheduleRevision", MonthDataModel>;
export interface ScheduleStateModel {
  persistentSchedule: StateWithHistory<ScheduleDataModel>;
  temporarySchedule: StateWithHistory<ScheduleDataModel>;
  scheduleErrors: GroupedScheduleErrors;
  revision: RevisionType;
  mode: ScheduleMode;
  baseRevision: BaseMonthRevisionDataModel;
}

export interface ApplicationStateModel {
  actualState: ScheduleStateModel;
}
