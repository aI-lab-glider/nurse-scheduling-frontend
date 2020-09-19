import React from "react";
import { DataRow } from "../../../../logic/real-schedule-logic/data-row";
import { BaseCellComponent } from "./base-cell.component";
import { CellOptions } from "./cell-options.model";
import "./schedule-row.component.css";

export interface ScheduleRowOptions {
  dataRow?: DataRow;
  onRowUpdated?: (row: DataRow) => void;
  cellComponent?: (cellOptions: CellOptions) => JSX.Element;
}

export function ScheduleRowComponent({
  dataRow,
  cellComponent: CellComponent = BaseCellComponent,
  onRowUpdated,
}: ScheduleRowOptions) {
  let key = dataRow?.rowKey;
  let data = dataRow?.rowData(false) || [];

  function onShiftChange(index: number, newShift: string) {
    dataRow = dataRow as DataRow;
    dataRow.setValue(index, newShift);
    if (onRowUpdated) {
      onRowUpdated(dataRow);
    }
  }

  return (
    <tr className="row">
      <BaseCellComponent
        value={key || ""}
        className={`key ${!dataRow || dataRow?.isEmpty ? "hidden" : ""}`}
      />
      {data.map((cellData, index) => {
        return (
          <CellComponent
            key={`${cellData}${index}`}
            value={cellData}
            onDataChanged={(newValue) => onShiftChange(index, newValue)}
            className={`key ${!dataRow || dataRow?.isEmpty ? "hidden" : ""}`}
          />
        );
      })}
    </tr>
  );
}
