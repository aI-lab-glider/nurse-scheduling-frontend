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

const ShiftCodeSelectItems = shiftCodes.map((shiftCode) => createSelectItem(shiftCode));

function createSelectItem(shiftCode: ShiftCode): { name: string; symbol: string; code: ShiftCode } {
  return {
    name:
      `${shifts[shiftCode].name}` +
      `${
        shifts[shiftCode].isWorkingShift
          ? `: ${shifts[shiftCode].from}-${shifts[shiftCode].to}`
          : ""
      }`,
    symbol: `${shifts[shiftCode].code}`,
    code: shiftCode,
  };
}

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
