import React from "react";
import { CellManagementKeys } from "./base-cell.component";

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

  return <input autoFocus={true} className={className} onKeyDown={handleKeyDown} />;
}
