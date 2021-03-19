/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import React from "react";
import {
  AlgorithmErrorCode,
  GroupedScheduleErrors,
  ScheduleError,
} from "../../../../../../common-models/schedule-error.model";
import { WorkerType } from "../../../../../../common-models/worker-info.model";
import { Sections } from "../../../../../../logic/providers/schedule-provider.model";
import { ShiftCellComponent } from "../../schedule-parts/shift-cell/shift-cell.component";
import { ShiftRowComponent } from "../../schedule-parts/shift-row.component";
import { BaseSectionComponent, BaseSectionOptions } from "../base-section/base-section.component";

export interface ShiftsSectionOptions extends Omit<BaseSectionOptions, "sectionKey"> {
  workerType: WorkerType;
}

function shiftSectionErrorSelector(
  worker: string,
  cellIndex: number,
  scheduleErrors: GroupedScheduleErrors
): ScheduleError[] {
  const errors = [
    ...(scheduleErrors[AlgorithmErrorCode.DissalowedShiftSequence]?.filter(
      (error) => error.worker === worker && error.day === cellIndex
    ) ?? []),
    ...(scheduleErrors[AlgorithmErrorCode.LackingLongBreak]?.filter(
      (error) => error.worker === worker && Math.floor(cellIndex / 7) === error.week
    ) ?? []),
  ];

  return errors.map((x) => {
    if ("week" in x) {
      if (Math.floor(cellIndex % 7) === 0) return { ...x, className: "left" };
      else if (Math.floor(cellIndex % 7) === 6) return { ...x, className: "right" };
      else return { ...x, className: "middle" };
    } else return x;
  });
}

export function ShiftsSectionComponent(options: ShiftsSectionOptions): JSX.Element {
  const { data = [], workerType, uuid } = options;
  const sectionKey: keyof Sections =
    workerType === WorkerType.NURSE ? "NurseInfo" : "BabysitterInfo";

  return (
    <div>
      <BaseSectionComponent
        {...options}
        key={uuid}
        data={data}
        sectionKey={sectionKey}
        cellComponent={ShiftCellComponent}
        rowComponent={ShiftRowComponent}
        errorSelector={shiftSectionErrorSelector}
      />
    </div>
  );
}
