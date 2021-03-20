/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import React from "react";
import { WorkerGroup } from "../../common-models/worker-info.model";
import { DataRow } from "../../logic/schedule-logic/data-row";
import { SummaryTableRow } from "./summarytable-row.component";

export interface SummaryTableSectionOptions {
  dataRows: DataRow[];
  workerGroup: WorkerGroup;
}

export function SummaryTableSection({
  dataRows,
  workerGroup: workerType,
}: SummaryTableSectionOptions): JSX.Element {
  return (
    <>
      <table
        className="table"
        id="summaryTable"
        data-cy={`${workerType.toLowerCase()}SummaryTable`}
      >
        <tbody>
          {dataRows.map((dataRow, rowIndex) => {
            return (
              <SummaryTableRow
                key={dataRow.rowKey}
                workerName={dataRow.rowKey}
                rowIndex={rowIndex}
              />
            );
          })}
        </tbody>
      </table>
    </>
  );
}
