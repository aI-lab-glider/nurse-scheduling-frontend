/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import React, { useCallback } from "react";
import {
  CellInput,
  CellInputOptions,
} from "../../../base/base-cell/cell-blockable-input.component";
import { ShiftAutocompleteComponent } from "../shift-autocomplete.component";
import { ContentWrapper } from "./shift-cell.styled";
import { getShiftCode } from "./shift-cell.component";

interface ShiftsCellDropdownInputOptions extends Omit<CellInputOptions, "input"> {
  isBlocked: boolean;
  onClick?: () => void;
}
export function ShiftsCellDropdown(options: ShiftsCellDropdownInputOptions) {
  const { isBlocked, onClick, onValueChange: UserDefinedOnValueChange } = options;
  const conditionalClick = useCallback(() => {
    if (!isBlocked) onClick?.();
  }, [isBlocked, onClick])

  const onValueChange = useCallback((inputValue: string): void => {
    UserDefinedOnValueChange?.(getShiftCode(inputValue));
  }, [UserDefinedOnValueChange])

  return (
    <ContentWrapper onClick={conditionalClick}>
      <CellInput input={ShiftAutocompleteComponent} onValueChange={onValueChange} {...options} />
    </ContentWrapper>
  );
}
