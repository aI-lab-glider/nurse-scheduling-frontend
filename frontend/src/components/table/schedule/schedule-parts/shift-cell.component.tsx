import React from "react";
import { ShiftCode } from "../../../../common-models/shift-info.model";
import { BaseCellComponent, BaseCellOptions } from "./base-cell.component";

function getShiftCode(value: string | number): ShiftCode {
  return typeof value === "number" ? value.toString() : ShiftCode[value] || ShiftCode.W;
}

type ShiftCellOptions = BaseCellOptions;

export function ShiftCellComponent(options: ShiftCellOptions): JSX.Element {
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
    />
  );
}
