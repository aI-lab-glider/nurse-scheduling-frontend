/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import { WorkerType } from "../../common-models/worker-info.model";
import { ShiftHelper } from "../../helpers/shifts.helper";
import { ChildrenInfoProvider } from "./children-info-provider.model";
import { ExtraWorkersInfoProvider } from "./extra-workers-info-provider.model";
import { Sections } from "./schedule-provider.model";
import { ScheduleError } from "../../common-models/schedule-error.model";
import { ShiftModel } from "../../common-models/shift-info.model";

export interface FoundationInfoOptions extends Pick<Sections, "NurseInfo" | "BabysitterInfo"> {
  ChildrenInfo: ChildrenInfoProvider;
  ExtraWorkersInfo: ExtraWorkersInfoProvider;
}

export abstract class FoundationInfoProvider {
  get errors(): ScheduleError[] {
    return [
      ...this.sections.NurseInfo.errors,
      ...this.sections.BabysitterInfo.errors,
      ...this.sections.ChildrenInfo.errors,
      ...this.sections.ExtraWorkersInfo.errors,
    ];
  }
  get childrenInfo(): number[] {
    return this.sections.ChildrenInfo.registeredChildrenNumber;
  }

  get extraWorkersInfo(): number[] {
    return this.sections.ExtraWorkersInfo.extraWorkers;
  }

  getWorkersCount(type: WorkerType, shiftsType: ShiftModel): number[] {
    if (type === WorkerType.NURSE) {
      return ShiftHelper.getWorkersCount(this.sections.NurseInfo.workerShifts, shiftsType);
    } else
      return ShiftHelper.getWorkersCount(this.sections.BabysitterInfo.workerShifts, shiftsType);
  }

  getAllWorkersNumber(): number {
    return (
      this.sections.NurseInfo.workersCount +
      this.sections.BabysitterInfo.workersCount +
      this.sections.ExtraWorkersInfo.workersCount
    );
  }

  constructor(protected sections: FoundationInfoOptions) {}
}
