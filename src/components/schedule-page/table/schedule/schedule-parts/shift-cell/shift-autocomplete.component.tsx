import React from "react";
import { ShiftCode } from "../../../../../../common-models/shift-info.model";
import { AutocompleteComponent } from "../../../../../common-components/autocomplete/autocomplete.component";
import { BaseCellInputOptions } from "../base-cell/base-cell-input.component";
const ShiftCodeSelectItems = [
  { name: "rano: 7-15", symbol: "R", code: ShiftCode.R },
  { name: "popołudnie: 15-19", symbol: "P", code: ShiftCode.P },
  { name: "dzień: 7-19", symbol: "D", code: ShiftCode.D },
  { name: "noc: 19-7", symbol: "N", code: ShiftCode.N },
  { name: "dzień + noc: 7-7", symbol: "DN", code: ShiftCode.DN },
  { name: "popołudnie + noc: 15-7", symbol: "PN", code: ShiftCode.PN },
  { name: "wolne", symbol: "W", code: ShiftCode.W },
  { name: "urlop", symbol: "U", code: ShiftCode.U },
  { name: "L4", symbol: "L4", code: ShiftCode.L4 },
];
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
