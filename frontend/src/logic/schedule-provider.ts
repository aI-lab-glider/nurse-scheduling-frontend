import { WorkerType } from "../common-models/worker-info.model";
import { ScheduleDataModel } from "../common-models/schedule-data.model";
import { ScheduleErrorModel } from "../common-models/schedule-error.model";
import { ShiftCode } from "../common-models/shift-info.model";

export interface MetadataProvider {
  monthNumber: number;
  year: number;
  daysFromPreviousMonthExists: boolean;
  frozenDates?: [number | string, number][];
  dates: number[];
}

export interface ShiftsProvider {
  errors: ScheduleErrorModel[];
  getWorkerShifts(): { [workerName: string]: ShiftCode[] };
  availableWorkersWorkTime(): { [key: string]: number };
  workersCount: number;
}

export interface ChildrenInfoProvider {
  registeredChildrenNumber: number[];
}

export interface ExtraWorkersInfoProvider {
  extraWorkers: number[];
}

export interface ScheduleProvider {
  readonly metadataProvider?: MetadataProvider;
  readonly nurseInfoProvider: ShiftsProvider;
  readonly babysitterInfoProvider: ShiftsProvider;
  readonly childrenInfoProvider: ChildrenInfoProvider;
  readonly extraWorkersInfoProvider: ExtraWorkersInfoProvider;
  getWorkerTypes(): { [workerName: string]: WorkerType };
}

export class Schedule {
  private provider: ScheduleProvider;

  constructor(provider: ScheduleProvider) {
    this.provider = provider;
  }

  /* eslint-disable @typescript-eslint/camelcase */
  public getDataModel(): ScheduleDataModel {
    return {
      schedule_info: {
        month_number: this.provider.metadataProvider?.monthNumber ?? 0,
        year: this.provider.metadataProvider?.year ?? 0,
        daysFromPreviousMonthExists:
          this.provider.metadataProvider?.daysFromPreviousMonthExists ?? false,
      },
      shifts: {
        ...this.provider.nurseInfoProvider.getWorkerShifts(),
        ...this.provider.babysitterInfoProvider.getWorkerShifts(),
      },
      month_info: {
        frozen_shifts: this.provider.metadataProvider?.frozenDates ?? [],
        children_number: this.provider.childrenInfoProvider.registeredChildrenNumber,
        dates: this.provider.metadataProvider?.dates ?? [],
        extra_workers: this.provider.extraWorkersInfoProvider.extraWorkers ?? [],
      },
      employee_info: {
        type: this.provider.getWorkerTypes(),
        time: {
          ...this.provider.babysitterInfoProvider.availableWorkersWorkTime(),
          ...this.provider.nurseInfoProvider.availableWorkersWorkTime(),
        },
      },
    };
  }
  /* eslint-enable @typescript-eslint/camelcase */
}
