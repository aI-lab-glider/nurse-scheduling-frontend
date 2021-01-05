/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import { WorkerType } from "../../common-models/worker-info.model";
import { ShiftHelper } from "../../helpers/shifts.helper";
import { ChildrenInfoProvider } from "./children-info-provider.model";
import { ExtraWorkersInfoProvider } from "./extra-workers-info-provider.model";
import { Sections } from "./schedule-provider.model";
import { ShiftsProvider } from "./shifts-provider.model";

export interface FoundationInfoOptions extends Pick<Sections, "NurseInfo" | "BabysitterInfo"> {
  NurseInfo: ShiftsProvider;
  BabysitterInfo: ShiftsProvider;
  ChildrenInfo: ChildrenInfoProvider;
  ExtraWorkersInfo: ExtraWorkersInfoProvider;
}

export abstract class FoundationInfoProvider {
  get childrenInfo(): number[] {
    return this.sections.ChildrenInfo.registeredChildrenNumber;
  }
  get extraWorkersInfo(): number[] {
    return this.sections.ExtraWorkersInfo.extraWorkers;
  }

  getWorkersCount(type: WorkerType): number[] {
    if (type === WorkerType.NURSE) {
      return ShiftHelper.getWorkersCount(this.sections.NurseInfo.workerShifts);
    } else return ShiftHelper.getWorkersCount(this.sections.BabysitterInfo.workerShifts);
  }

  constructor(protected sections: FoundationInfoOptions) {}
}
