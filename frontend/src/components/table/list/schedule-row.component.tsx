import React from "react";
import { DataRow } from "../../../logic/schedule/data-row.logic";
import { BaseCellComponent } from "./cell-components/base-cell.component";
import { CellOptions } from "./cell-components/cell-options.model";
import "./row.css";

export interface ScheduleRowOptions {
  dataRow?: DataRow;
  onRowUpdate?: (row: DataRow) => void;
  CellComponent?: (cellOptions: CellOptions) => JSX.Element;
}

export function ScheduleRowComponent({
  dataRow,
  CellComponent = BaseCellComponent,
  onRowUpdate,
}: ScheduleRowOptions) {
  let key = dataRow?.rowKey;
  let data = dataRow?.rowData(false) || [];

  function onShiftChange(index: number, newShift: string) {
    dataRow = dataRow as DataRow;
    dataRow.setValue(index, newShift);
    if (onRowUpdate) {
      onRowUpdate(dataRow);
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
            onDataChange={(newValue) => onShiftChange(index, newValue)}
            className={`key ${!dataRow || dataRow?.isEmpty ? "hidden" : ""}`}
          />
        );
      })}
    </tr>
  );
}
