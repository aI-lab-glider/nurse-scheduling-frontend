import { ScheduleDataModel } from "../state/models/schedule-data/schedule-data.model";
import { Shift } from "../state/models/schedule-data/shift-info.model";
import { WorkerType } from "../state/models/schedule-data/employee-info.model";

export interface MetadataProvider {
  monthNumber: number;
  year: number;
  daysFromPreviousMonthExists: boolean;
  frozenDates?: [number | string, number][];
  dates: number[];
}

export interface ShiftsProvider {
  getWorkerShifts(): { [workerName: string]: Shift[] };
  mockEmployeeWorkTime(): { [key: string]: number };
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
  readonly extraWorkersInfoProvider?: ExtraWorkersInfoProvider;
  getWorkerTypes(): { [workerName: string]: WorkerType[] };
}

export class Schedule {
  private provider: ScheduleProvider;

  constructor(provider: ScheduleProvider) {
    this.provider = provider;
  }

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
        extra_workers: this.provider.extraWorkersInfoProvider?.extraWorkers ?? [],
      },
      employee_info: {
        type: this.provider.getWorkerTypes(),
        babysitterCount: this.provider.babysitterInfoProvider.workersCount || 0,
        nurseCount: this.provider.nurseInfoProvider.workersCount || 0,
        time: {
          ...this.provider.babysitterInfoProvider.mockEmployeeWorkTime(),
          ...this.provider.nurseInfoProvider.mockEmployeeWorkTime(),
        },
      },
    };
  }
}
