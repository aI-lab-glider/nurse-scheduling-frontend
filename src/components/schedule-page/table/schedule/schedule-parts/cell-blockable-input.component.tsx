/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import React from "react";
import { BaseCellInputOptions } from "./base-cell/base-cell-input.component";

export enum CellManagementKeys {
  Enter = "Enter",
  Escape = "Escape",
}

export interface CellBlockableInputComponentOptions {
  isPointerOn: boolean;
  isBlocked: boolean;
  input: React.FC<BaseCellInputOptions>;
  onValueChange?: (value: string) => void;
  onKeyDown?: (event: React.KeyboardEvent<HTMLInputElement>) => void;
}

export function CellBlockableInputComponent({
  isBlocked,
  isPointerOn,
  input: InputComponent,
  onValueChange,
  onKeyDown,
}: CellBlockableInputComponentOptions): JSX.Element {
  function _onKeyDown(e: React.KeyboardEvent<HTMLInputElement>): void {
    if (e.key === CellManagementKeys.Enter) {
      onValueChange?.(e.currentTarget.value);
      return;
    }
    onKeyDown?.(e);
  }

  return (
    <>
      {isPointerOn && !isBlocked && (
        <InputComponent
          className="cell-input"
          onValueChange={(value): void => onValueChange?.(value)}
          onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>): void => _onKeyDown(e)}
        />
      )}
    </>
  );
}
