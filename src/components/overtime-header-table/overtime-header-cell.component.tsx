/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import React from "react";

export interface OvertimeHeaderCellOptions {
  value: string;
}

function OvertimeHeaderCellF({ value }: OvertimeHeaderCellOptions): JSX.Element {
  return (
    <td className="overtimeHeaderCell" id="thisMonthHeader">
      <span className="rotated">{value}</span>
    </td>
  );
}

export const OvertimeHeaderCell: React.FC<OvertimeHeaderCellOptions> = React.memo(
  OvertimeHeaderCellF,
  (prev, next) => {
    return prev.value === next.value;
  }
);
