/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import React from "react";
import { CellManagementKeys } from "../cell-blockable-input.component";

export interface BaseCellInputOptions {
  className: string;
  onValueChange: (value: string) => void;
  onKeyDown: (event: React.KeyboardEvent<HTMLInputElement>) => void;
}

export function BaseCellInputComponent({
  className,
  onValueChange,
  onKeyDown,
}: BaseCellInputOptions): JSX.Element {
  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>): void {
    if (e.key === CellManagementKeys.Enter) {
      onValueChange(e.currentTarget.value);
      return;
    }
    onKeyDown(e);
  }

  return (
    <input
      autoFocus={true}
      className={className}
      onKeyDown={handleKeyDown}
      onBlur={(e) => !!e.currentTarget.value && onValueChange(e.currentTarget.value)}
    />
  );
}
