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
