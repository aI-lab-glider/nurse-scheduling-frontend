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
