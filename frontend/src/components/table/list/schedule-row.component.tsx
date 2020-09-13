import React from "react";
import { StringHelper } from "../../../helpers/string.helper";
import { DataRow } from "../../../logic/schedule/data-row.logic";
import { BaseCellComponent } from "./cell-components/base-cell.component";
import { Cell } from "./cell-components/cell.model";
import "./row.css";

export function ScheduleRowComponent(
  dataRow?: DataRow,
  cellComponent: (cellValue) => Cell = BaseCellComponent
) {
  let key = dataRow?.rowKey;
  let data = dataRow?.rowData(false) || [];
  return (
    <tr className="row" key={StringHelper.generateUuidv4()}>
      {BaseCellComponent(key || "", `key ${!dataRow || dataRow?.isEmpty ? "hidden" : ""}`)}
      {data.map((cellData) => {
        return cellComponent(cellData);
      })}
    </tr>
  );
}
