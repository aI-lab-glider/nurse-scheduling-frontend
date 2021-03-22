/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import { ScheduleError } from "../../common-models/schedule-error.model";
import { ShiftCode } from "../../common-models/shift-info.model";
import { WorkerGroup } from "../../common-models/worker-info.model";

export abstract class ShiftsProvider {
  abstract get errors(): ScheduleError[];
  abstract get workerShifts(): { [workerName: string]: ShiftCode[] };
  abstract get availableWorkersWorkTime(): { [key: string]: number };
  abstract get availableWorkersGroup(): { [workerName: string]: WorkerGroup };
  abstract get workersCount(): number;
  get workers(): string[] {
    return [];
  }
}
