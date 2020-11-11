import React from "react";
import { ShiftCode } from "../../../../common-models/shift-info.model";
import { BaseCellComponent, BaseCellOptions } from "./base-cell.component";

function getShiftCode(value: string | number): ShiftCode {
  return typeof value === "number" ? value.toString() : ShiftCode[value] || ShiftCode.W;
}

type ShiftCellOptions = BaseCellOptions;

export function ShiftCellComponent(options: ShiftCellOptions): JSX.Element {
  const { onKeyDown, value } = options;
  const shiftValue = getShiftCode(value);

  return (
    <BaseCellComponent
      {...options}
      onKeyDown={(inputValue: string, key: React.KeyboardEvent): void => {
        onKeyDown && onKeyDown(getShiftCode(inputValue), key);
      }}
      value={shiftValue === ShiftCode.W ? "" : shiftValue}
    />
  );
}
