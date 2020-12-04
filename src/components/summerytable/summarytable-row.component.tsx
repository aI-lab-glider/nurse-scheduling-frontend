import React, { useContext } from "react";
import { DataRow } from "../../logic/schedule-logic/data-row";
import { ScheduleLogicContext } from "../schedule-page/table/schedule/use-schedule-state";
import { DataRowHelper } from "../../helpers/data-row.helper";
import { SummaryTableCell } from "./summarytable-cell.component";
import { ShiftHelper } from "../../helpers/shifts.helper";
import { WorkerType } from "../../common-models/worker-info.model";

export interface SummaryTableRowOptions {
  uuid: string;
  dataRow: DataRow;
}

export function SummaryTableRowF({ dataRow, uuid }: SummaryTableRowOptions): JSX.Element {
  const scheduleLogic = useContext(ScheduleLogicContext);

  function f(): [number, number, number] {
    return ShiftHelper.rowWorkHoursInfo(dataRow, scheduleLogic, WorkerType.NURSE);
  }

  const data = f();

  return (
    <tr className="row" id="summaryRow">
      {data.map((cellData, cellIndex) => {
        return (
          <SummaryTableCell
            key={`${dataRow.rowKey}_${cellData}_${cellIndex}${uuid}}`}
            value={cellData}
          />
        );
      })}
    </tr>
  );
}

export const SummaryTableRow = React.memo(SummaryTableRowF, (prev, next) => {
  return DataRowHelper.areDataRowsEqual(prev.dataRow, next.dataRow);
});
