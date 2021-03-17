/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import _ from "lodash";
import React from "react";
import { SHIFTS as shifts } from "../../../../../../common-models/shift-info.model";
import { AutocompleteComponent } from "../../../../../common-components";
import { BaseCellInputOptions } from "../base-cell/base-cell-input.component";

const ShiftCodeSelectItems = _.sortBy(
  Object.values(shifts).map((shift) => {
    return {
      name: `${shift.name} ${shift.isWorkingShift ? `(${shift.from}-${shift.to})` : ""}`,
      symbol: shift.code,
      from: shift.from,
      to: shift.to,
      code: shift.code,
      color: shift.color ? shift.color : "$white",
      "data-cy": `autocomplete-${shift.code}`,
    };
  }),
  ["from", "to", "name"]
);
export function ShiftAutocompleteComponent(inputOptions: BaseCellInputOptions): JSX.Element {
  return (
    <AutocompleteComponent
      className={inputOptions.className}
      options={ShiftCodeSelectItems}
      getOptionLabel={(option): string => option.name}
      getOptionColor={(option): string => option.color}
      onValueChange={(option): void => inputOptions.onValueChange(option.code)}
      onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>): void => inputOptions.onKeyDown(e)}
    />
  );
}
