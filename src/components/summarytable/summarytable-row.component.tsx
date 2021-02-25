/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import React from "react";
import { ArrayHelper } from "../../helpers/array.helper";
import { SummaryTableCell } from "./summarytable-cell.component";
import { summaryRowDataCy, SummaryTableRowOptions } from "./summarytable-row.models";

export function SummaryTableRowF({ uuid, data, rowIndex }: SummaryTableRowOptions): JSX.Element {
  return (
    <tr className="row" id="summaryRow" data-cy={summaryRowDataCy(rowIndex)}>
      {data.map((cellData, cellIndex) => {
        return (
          <SummaryTableCell
            key={`${cellData}_${cellIndex}${uuid}}`}
            value={cellData}
            cellIndex={cellIndex}
          />
        );
      })}
    </tr>
  );
}

export const SummaryTableRow = React.memo(SummaryTableRowF, (prev, next) => {
  return ArrayHelper.arePrimitiveArraysEqual(prev.data, next.data);
});
