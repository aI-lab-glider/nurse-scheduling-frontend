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
  return (
    errors[AlgorithmErrorCode.AlwaysAtLeastOneNurse]?.filter(
      (error) => error.kind === AlgorithmErrorCode.AlwaysAtLeastOneNurse && error.day === cellIndex
    ) ?? []
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
