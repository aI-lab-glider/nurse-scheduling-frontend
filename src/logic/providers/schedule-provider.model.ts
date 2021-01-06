/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import { WorkerType } from "../../common-models/worker-info.model";
import { ScheduleDataModel } from "../../common-models/schedule-data.model";
import { ShiftsProvider } from "./shifts-provider.model";
import { MetadataProvider } from "./metadata-provider.model";
import { FoundationInfoProvider } from "./foundation-info-provider.model";

export interface Sections {
  Metadata: MetadataProvider;
  NurseInfo: ShiftsProvider;
  BabysitterInfo: ShiftsProvider;
  FoundationInfo: FoundationInfoProvider;
}
export interface ScheduleProvider {
  readonly sections: Sections;
  getWorkerTypes(): { [workerName: string]: WorkerType };
}

export class Schedule {
  private provider: ScheduleProvider;

  constructor(provider: ScheduleProvider) {
    this.provider = provider;
  }

  /* eslint-disable @typescript-eslint/camelcase */
  public getDataModel(): ScheduleDataModel {
    const sections = this.provider.sections;
    return {
      schedule_info: {
        month_number: sections.Metadata.monthNumber ?? 0,
        year: sections.Metadata?.year ?? 0,
        daysFromPreviousMonthExists: sections.Metadata?.daysFromPreviousMonthExists ?? false,
      },
      shifts: {
        ...sections.BabysitterInfo.workerShifts,
        ...sections.NurseInfo.workerShifts,
      },
      month_info: {
        frozen_shifts: sections.Metadata.frozenDates ?? [],
        children_number: sections.FoundationInfo.childrenInfo,
        dates: sections.Metadata.dates ?? [],
        extra_workers: sections.FoundationInfo.extraWorkersInfo ?? [],
      },
      employee_info: {
        type: this.provider.getWorkerTypes(),
        time: {
          ...sections.NurseInfo.availableWorkersWorkTime,
          ...sections.BabysitterInfo.availableWorkersWorkTime,
        },
      },
    };
  }
  /* eslint-enable @typescript-eslint/camelcase */
}
