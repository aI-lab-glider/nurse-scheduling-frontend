import { VerboseDate } from "../../../../../../common-models/month-info.model";
import { CellColorSet } from "../../../../../../helpers/colors/cell-color-set.model";
import { BaseCellInputOptions } from "./base-cell-input.component";

export type CellType = "cell" | "highlighted-cell";
export const baseCellDataCy = (index: number, cellType: CellType): string => `${index}-${cellType}`;

export enum CellManagementKeys {
  Enter = "Enter",
  Escape = "Escape",
}

export const PivotCellType = "Cell";

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
