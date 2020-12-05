import React from "react";
import { DataRow } from "../../../../../logic/schedule-logic/data-row";
import { BaseRowComponent, BaseRowOptions } from "./base-row.component";
import { ShiftCellComponent } from "./shift-cell/shift-cell.component";
import { BaseCellOptions } from "./base-cell/base-cell.component";

export interface ShiftRowOptions extends BaseRowOptions {
  dataRow: DataRow;
  onRowUpdated?: (row: DataRow) => void;
  cellComponent?: React.FC<BaseCellOptions>;
}

export function ShiftRowComponent(options: ShiftRowOptions): JSX.Element {
  const { dataRow } = options;

  return <BaseRowComponent {...options} dataRow={dataRow} cellComponent={ShiftCellComponent} />;
}
