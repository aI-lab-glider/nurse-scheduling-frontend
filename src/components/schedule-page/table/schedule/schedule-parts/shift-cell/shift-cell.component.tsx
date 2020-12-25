import React from "react";
import { ShiftCode } from "../../../../../../common-models/shift-info.model";
import { BaseCellComponent, BaseCellOptions } from "../base-cell/base-cell.component";
import { ShiftAutocompleteComponent } from "./shift-autocomplete.component";

function getShiftCode(value: string | number): ShiftCode {
  return typeof value === "number" ? value.toString() : ShiftCode[value] || ShiftCode.W;
}

type ShiftCellOptions = BaseCellOptions;

export function ShiftCellComponent(options: ShiftCellOptions): JSX.Element {
  const { onValueChange, value } = options;
  const shiftValue = getShiftCode(value);
  function _onValueChange(inputValue: string): void {
    onValueChange && onValueChange(getShiftCode(inputValue));
  }

  return (
    <BaseCellComponent
      {...options}
      input={ShiftAutocompleteComponent}
      onValueChange={_onValueChange}
      value={shiftValue === ShiftCode.W ? "" : shiftValue}
    />
  );
}
