import React from "react";
import { ShiftCode } from "../../../../state/models/schedule-data/shift-info.model";
import { BaseCellComponent } from "./base-cell.component";
import { CellOptions } from "./cell-options.model";

function getShiftCode(value: string | number): ShiftCode {
  return typeof value === "number" ? value.toString() : ShiftCode[value] || ShiftCode.W;
}

export function ShiftCellComponent(options: CellOptions): JSX.Element {
  const shiftValue = getShiftCode(options.value);

  function _onKeyDown(inputValue: string, key: React.KeyboardEvent): void {
    const { onKeyDown } = options;
    onKeyDown && onKeyDown(getShiftCode(inputValue), key);
  }
  return (
    <BaseCellComponent
      {...options}
      onKeyDown={_onKeyDown}
      value={shiftValue === ShiftCode.W ? "" : shiftValue}
    ></BaseCellComponent>
  );
}
