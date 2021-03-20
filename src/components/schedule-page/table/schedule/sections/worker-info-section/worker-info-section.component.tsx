/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import React from "react";
import { WorkerGroup } from "../../../../../../common-models/worker-info.model";
import { DataRow } from "../../../../../../logic/schedule-logic/data-row";
import { NameTableSectionOptions } from "../../../../../namestable/nametable-section.component";
import { NameTableComponent } from "../../../../../namestable/nametable.component";
import { WorkerInfo } from "../../../../../namestable/use-worker-info";
import {
  SummaryTableComponent,
  SummaryTableOptions,
} from "../../../../../summarytable/summarytable.component";
import {
  ShiftsSectionComponent,
  ShiftsSectionOptions,
} from "../shifts-section/shifts-section.component";

type SubcomponentsOptions = Omit<NameTableSectionOptions, "clickable" | "uuid" | "updateData"> &
  ShiftsSectionOptions &
  SummaryTableOptions;
export interface WorkerInfoSectionOptions
  extends Omit<SubcomponentsOptions, "data" | "workerGroup" | "sectionKey"> {
  sectionName: string;
  data: WorkerInfo[];
}

export function WorkerInfoSection({ data, ...options }: WorkerInfoSectionOptions): JSX.Element {
  const dataRows = data.map(
    (workerInfo) => new DataRow(workerInfo.workerName, workerInfo.workerShifts)
  );
  return (
    <tr className="sectionContainer">
      <td>
        <NameTableComponent data={dataRows} clickable={true} {...options} />
      </td>
      <td>
        <table>
          <tbody className="table" data-cy="nurseShiftsTable">
            <ShiftsSectionComponent sectionKey={options.sectionName} data={dataRows} {...options} />
          </tbody>
        </table>
      </td>
      <td className="summaryContainer">
        <SummaryTableComponent
          workerGroup={options.sectionName as WorkerGroup}
          data={dataRows}
          {...options}
        />
      </td>
    </tr>
  );
}
