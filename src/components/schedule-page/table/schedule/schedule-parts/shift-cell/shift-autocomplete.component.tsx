import React from "react";
import { ShiftCode, shifts } from "../../../../../../common-models/shift-info.model";
import { AutocompleteComponent } from "../../../../../common-components";
import { BaseCellInputOptions } from "../base-cell/base-cell-input.component";

const shiftCodes: ShiftCode[] = [
  ShiftCode.R,
  ShiftCode.P,
  ShiftCode.D,
  ShiftCode.N,
  ShiftCode.DN,
  ShiftCode.PN,
  ShiftCode.W,
  ShiftCode.U,
  ShiftCode.L4,
];
const ShiftCodeSelectItems = Object.values(shifts).map((shift) => {
  return {
    name: `${shift.name}` + `${shift.isWorkingShift ? `: ${shift.from}-${shift.to}` : ""}`,
    symbol: shift.code,
    code: shift.code,
  };
});

export function ShiftAutocompleteComponent(inputOptions: BaseCellInputOptions): JSX.Element {
  return (
    <AutocompleteComponent
      className={inputOptions.className}
      options={ShiftCodeSelectItems}
      getOptionLabel={(option): string => option.name}
      onValueChange={(option): void => inputOptions.onValueChange(option.code)}
      onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>): void => inputOptions.onKeyDown(e)}
    />
  );
}
