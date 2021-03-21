/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import React from "react";
import { summaryCellDataCy, SummaryTableCellOptions } from "./summarytable-cell.models";

function SummaryTableCellF({ value, cellIndex }: SummaryTableCellOptions): JSX.Element {
  return (
    <div className="summaryCell" data-cy={summaryCellDataCy(cellIndex)}>
      <span>{value}</span>
    </div>
  );
}

export const SummaryTableCell: React.FC<SummaryTableCellOptions> = React.memo(
  SummaryTableCellF,
  (prev, next) => {
    return prev.value === next.value;
  }
);
