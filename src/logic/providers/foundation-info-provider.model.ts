import { ShiftInfoModel } from "../../common-models/shift-info.model";
import { WorkerType } from "../../common-models/worker-info.model";
import { ArrayHelper } from "../../helpers/array.helper";
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
  get workersShifts(): ShiftInfoModel {
    return {
      ...this.sections.BabysitterInfo.workerShifts,
      ...this.sections.NurseInfo.workerShifts,
    };
  }
  get childrenInfo(): number[] {
    return this.sections.ChildrenInfo.registeredChildrenNumber;
  }
  get extraWorkersInfo(): number[] {
    return this.sections.ExtraWorkersInfo.extraWorkers;
  }
  getWorkersCount(): number[] {
    return ShiftHelper.getWorkersCount(this.workersShifts);
  }

  constructor(protected sections: FoundationInfoOptions) {}
}
