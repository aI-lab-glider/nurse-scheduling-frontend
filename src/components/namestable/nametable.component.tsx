/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import React from "react";
import {
  AlgorithmErrorCode,
  GroupedScheduleErrors,
  ScheduleError,
} from "../../common-models/schedule-error.model";
import { WorkerType } from "../../common-models/worker-info.model";
import { BaseSectionOptions } from "../schedule-page/table/schedule/sections/base-section/base-section.component";
import { NameTableSection } from "./nametable-section.component";

interface NameSectionOptions extends Partial<BaseSectionOptions> {
  workerType?: WorkerType;
  clickable: boolean;
}

function nametableErrorSelector(
  worker: string,
  cellIndex: number,
  scheduleErrors: GroupedScheduleErrors
): ScheduleError[] {
  const errors = [
    ...(scheduleErrors[AlgorithmErrorCode.WorkerOvertime]?.filter(
      (error) => error.kind === AlgorithmErrorCode.WorkerOvertime && error.worker === worker
    ) ?? []),
    ...(scheduleErrors[AlgorithmErrorCode.WorkerNumberDuringNight]?.filter(
      (error) => error.kind === AlgorithmErrorCode.WorkerUnderTime && error.worker === worker
    ) ?? []),
  ];
  return errors;
}

export function NameTableComponent(options: NameSectionOptions): JSX.Element {
  const { data = [], workerType, clickable } = options;

  return (
    <div>
      <NameTableSection
        dataRow={data}
        workerType={workerType}
        errorSelector={nametableErrorSelector}
        clickable={clickable}
      />
    </div>
  );
}
