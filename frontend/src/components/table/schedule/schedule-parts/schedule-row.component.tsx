import React from "react";
import { DataRow } from "../../../../logic/real-schedule-logic/data-row";
import { MetadataLogic } from "../../../../logic/real-schedule-logic/metadata.logic";
import { BaseCellComponent } from "./base-cell.component";
import { CellOptions } from "./cell-options.model";
import "./schedule-row.component.css";

export interface ScheduleRowOptions {
  dataRow?: DataRow;
  metaDataLogic?: MetadataLogic,
  onRowUpdated?: (row: DataRow) => void;
  cellComponent?: (cellOptions: CellOptions) => JSX.Element;
}

export function ScheduleRowComponent({
  dataRow,
  cellComponent: CellComponent = BaseCellComponent,
  onRowUpdated,
  metaDataLogic,
}: ScheduleRowOptions) {

  let key = dataRow?.rowKey;
  let data = dataRow?.rowData(false) || [];
  const verboseDates = metaDataLogic?.verboseDates;

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
            dayType={verboseDates?.[index].dayOfWeek || ""}
            onDataChanged={(newValue) => onShiftChange(index, newValue)}
            className={`key ${!dataRow || dataRow?.isEmpty ? "hidden" : ""}`}
            isEditable={!verboseDates?.[index].isBlocked}
          />
        );
      })}
    </tr>
  );
}
