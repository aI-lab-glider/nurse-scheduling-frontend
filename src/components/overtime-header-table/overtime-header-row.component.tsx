import React from "react";
import { ArrayHelper } from "../../helpers/array.helper";
import { OvertimeHeaderCell } from "./overtime-header-cell.component";

export interface OvertimeHeaderRowOptions {
  data: [string, string, string];
}

export function OvertimeHeaderRowF({ data }: OvertimeHeaderRowOptions): JSX.Element {
  return (
    <tr className="row" id="summaryRow">
      {data.map((cellData) => {
        return <OvertimeHeaderCell value={cellData} key={cellData} />;
      })}
    </tr>
  );
}

export const OvertimeHeaderRow = React.memo(OvertimeHeaderRowF, (prev, next) => {
  return ArrayHelper.arePrimitiveArraysEqual(prev.data, next.data);
});
