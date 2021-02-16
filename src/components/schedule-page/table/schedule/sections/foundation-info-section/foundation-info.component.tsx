/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import React from "react";
import {
  AlgorithmErrorCode,
  GroupedScheduleErrors,
  ScheduleError,
} from "../../../../../../common-models/schedule-error.model";
import { FoundationSectionKey } from "../../../../../../logic/section.model";
import { BaseSectionComponent, BaseSectionOptions } from "../base-section/base-section.component";
export type FoundationInfoOptions = Omit<BaseSectionOptions, "sectionKey">;

// TODO:
// 1. Define errors as interface with types. Should not be dictionary as it is now
// 2. Fix bug with monthswitcing
// 3. Fix paddings in summary row
// 4. Fix bad positioning in big monthes
function foundationInfoErrorSelector(
  rowKey: string,
  cellIndex: number,
  errors: GroupedScheduleErrors
): ScheduleError[] {
  if (rowKey !== FoundationSectionKey.NurseCount) {
    return [];
  }
  const foundationInfoErrors = [
    ...(errors[AlgorithmErrorCode.AlwaysAtLeastOneNurse] ?? []),
    ...(errors[AlgorithmErrorCode.WorkerNumberDuringDay] ?? []),
    ...(errors[AlgorithmErrorCode.WorkerNumberDuringNight] ?? []),
  ];
  return foundationInfoErrors.filter(
    (error) =>
      (error.kind === AlgorithmErrorCode.AlwaysAtLeastOneNurse && error.day === cellIndex) ||
      (error.kind === AlgorithmErrorCode.WorkerNumberDuringDay && error.day === cellIndex) ||
      (error.kind === AlgorithmErrorCode.WorkerNumberDuringNight && error.day === cellIndex)
  );
}

export function FoundationInfoComponent(options: FoundationInfoOptions): JSX.Element {
  return (
    <>
      <BaseSectionComponent
        {...options}
        sectionKey={"FoundationInfo"}
        errorSelector={foundationInfoErrorSelector}
      />
    </>
  );
}
