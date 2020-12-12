import React from "react";
import { OvertimeHeaderRow } from "./overtime-header-row.component";

interface OvertimeHeaderTableOptions {
  data: [string, string, string];
}

export function OvertimeHeaderComponent(options: OvertimeHeaderTableOptions): JSX.Element {
  const { data } = options;

  return (
    <div>
      <table className="table" id="overtimeHeaderTable">
        <tbody>
          <OvertimeHeaderRow data={data} />
        </tbody>
      </table>
    </div>
  );
}
