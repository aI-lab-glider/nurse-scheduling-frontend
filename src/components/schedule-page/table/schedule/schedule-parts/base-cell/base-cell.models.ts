/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */

import { VerboseDate } from "../../../../../../common-models/month-info.model";
import { CellColorSet } from "../../../../../../helpers/colors/cell-color-set.model";
import { BaseCellInputOptions } from "./base-cell-input.component";

export type CellType = "cell" | "highlighted-cell";
export const baseCellDataCy = (index: number, cellType: CellType): string => `${index}-${cellType}`;

export enum CellManagementKeys {
  Enter = "Enter",
  Escape = "Escape",
}

export const PivotCellTypePrefix = "Cell";
export interface PivotCell {
  type: string;
  rowIndex: number;
  cellIndex: number;
}

export interface BaseCellOptions {
  rowIndex: number;
  keepOn: boolean;
  hasNext: boolean;
  index: number;
  value: string;
  style?: CellColorSet;
  isBlocked: boolean;
  isPointerOn: boolean;
  isSelected: boolean;
  onClick?: () => void;
  onContextMenu?: () => void;
  onKeyDown?: (event: React.KeyboardEvent<HTMLInputElement>) => void;
  onValueChange?: (value: string) => void;
  onBlur?: () => void;
  input?: React.FC<BaseCellInputOptions>;
  monthNumber?: number;
  verboseDate?: VerboseDate;
  onDrag?: (pivotCell: PivotCell) => void;
  onDragEnd?: () => void;
  sectionKey: string;
}
