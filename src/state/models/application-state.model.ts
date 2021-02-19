/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import { ScheduleDataModel } from "../../common-models/schedule-data.model";
import { ScheduleErrorMessageModel } from "../../common-models/schedule-error-message.model";
import { StateWithHistory } from "redux-undo";
import { RevisionType } from "../../api/persistance-store.model";
import { ScheduleMode } from "../../components/schedule-page/table/schedule/use-schedule-state";

export interface ScheduleStateModel {
  persistentSchedule: StateWithHistory<ScheduleDataModel>;
  temporarySchedule: StateWithHistory<ScheduleDataModel>;
  scheduleErrors?: ScheduleErrorMessageModel[];
  revision: RevisionType;
  mode: ScheduleMode;
}

export interface ApplicationStateModel {
  actualState: ScheduleStateModel;
}
