/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import React from "react";
import { WorkerType } from "../../../../../../common-models/worker-info.model";
import { Sections } from "../../../../../../logic/providers/schedule-provider.model";
import { ShiftCellComponent } from "../../schedule-parts/shift-cell/shift-cell.component";
import { ShiftRowComponent } from "../../schedule-parts/shift-row.component";
import { BaseSectionComponent, BaseSectionOptions } from "../base-section/base-section.component";

export interface ShiftsSectionOptions extends Omit<BaseSectionOptions, "sectionKey"> {
  workerType: WorkerType;
}

export function ShiftsSectionComponent(options: ShiftsSectionOptions): JSX.Element {
  const { data = [], workerType, uuid } = options;
  const sectionKey: keyof Sections =
    workerType === WorkerType.NURSE ? "NurseInfo" : "BabysitterInfo";

  return (
    <>
      <table>
        <BaseSectionComponent
          {...options}
          key={uuid}
          data={data}
          sectionKey={sectionKey}
          cellComponent={ShiftCellComponent}
          rowComponent={ShiftRowComponent}
        />
      </table>
    </>
  );
}
