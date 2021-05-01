/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import React from "react";
import { CellManagementKeys } from "./cell-blockable-input.component";
import styled from "styled-components";

export interface BaseCellInputOptions {
  onValueChange: (value: string) => void;
  onKeyDown: (event: React.KeyboardEvent<HTMLInputElement>) => void;
}

export function BaseCellInputComponent({
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
    <Input
      autoFocus
      onKeyDown={handleKeyDown}
      onBlur={(e): void => {
        !!e.currentTarget.value && onValueChange(e.currentTarget.value);
      }}
    />
  );
}

const Input = styled.input`
  position: relative;
  padding-left: 60%;
  outline: none;
  border: none;
  overflow: hidden;
  width: 170%;
  height: 50px;
  left: -2px;
  top: -5px;
  font-size: 14px;
  font-family: Roboto, serif;
  line-height: 20px;
  letter-spacing: 0.75px;
  margin-bottom: -8px;
`;
