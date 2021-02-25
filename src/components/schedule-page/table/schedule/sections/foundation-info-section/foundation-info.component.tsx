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
  return foundationInfoErrors.filter((error) => error.day === cellIndex + 1);
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
