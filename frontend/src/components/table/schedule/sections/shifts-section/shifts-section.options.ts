import { WorkerType } from "../../../../../state/models/schedule-data/worker-info.model";
import { BaseSectionOptions } from "../base-section/base-section.options";

export interface ShiftsSectionOptions extends BaseSectionOptions {
  workerType: WorkerType;
}
