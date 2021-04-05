/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */

export interface ScheduleMetadata {
  UUID?: string;
  month_number: number; // 0 - 11
  year: number; // 2000 - 2100
}

export function validateScheduleInfo(scheduleInfo: ScheduleMetadata): void {
  if (scheduleInfo.month_number < 0 || scheduleInfo.month_number > 11) {
    throw new Error(`Month number has to be within range 0-11 not ${scheduleInfo.month_number}`);
  }

  if (scheduleInfo.year < 2000 || scheduleInfo.year > 2100) {
    throw new Error(`Year has to be within range 2000-2100 not ${scheduleInfo.year}`);
  }
}
