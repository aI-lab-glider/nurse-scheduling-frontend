/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import React from "react";
import { ShiftCode } from "../../../../../../common-models/shift-info.model";
import { BaseCellComponent } from "../base-cell/base-cell.component";
import { BaseCellOptions } from "../base-cell/base-cell.models";
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
