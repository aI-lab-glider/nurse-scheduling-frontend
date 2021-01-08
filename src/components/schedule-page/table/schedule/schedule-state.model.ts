/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import { DataRow } from "../../../../logic/schedule-logic/data-row";

export interface ScheduleComponentState {
  foundationInfoSection?: DataRow[];
  nurseShiftsSection?: DataRow[];
  babysitterShiftsSection?: DataRow[];
  dateSection?: DataRow[];
  isInitialized?: boolean;
  uuid: string;
}

export const scheduleInitialState: ScheduleComponentState = {
  nurseShiftsSection: [],
  babysitterShiftsSection: [],
  foundationInfoSection: [],
  dateSection: [],
  isInitialized: false,
  uuid: "",
};
