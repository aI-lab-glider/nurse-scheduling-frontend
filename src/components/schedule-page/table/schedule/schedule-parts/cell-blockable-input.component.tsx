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
}: CellBlockableInputComponentOptions) {
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
