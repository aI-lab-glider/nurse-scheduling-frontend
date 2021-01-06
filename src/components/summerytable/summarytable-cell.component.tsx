/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import React from "react";

export interface SummaryTableCellOptions {
  value: number;
}

function SummaryTableCellF({ value }: SummaryTableCellOptions): JSX.Element {
  return (
    <td className="summaryCell">
      <span>{value}</span>
    </td>
  );
}

export const SummaryTableCell: React.FC<SummaryTableCellOptions> = React.memo(
  SummaryTableCellF,
  (prev, next) => {
    return prev.value === next.value;
  }
);
