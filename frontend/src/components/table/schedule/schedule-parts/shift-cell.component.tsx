import React from "react";
import { ShiftCode } from "../../../../state/models/schedule-data/shift-info.model";
import { BaseCellComponent } from "./base-cell.component";
import { CellOptions } from "./cell-options.model";

function getShiftCode(value: string): ShiftCode {
  return ShiftCode[value] || ShiftCode.W;
}

export function ShiftCellComponent(options: CellOptions) {
  const value = getShiftCode(options.value);
  return (
    <BaseCellComponent {...options} value={value === ShiftCode.W ? "" : value}></BaseCellComponent>
  );
}
