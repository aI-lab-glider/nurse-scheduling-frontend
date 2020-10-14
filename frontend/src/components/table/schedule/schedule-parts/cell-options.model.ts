import { CellColorSet } from "../../../../helpers/colors/cell-color-set.model";

export enum CellState {
  START_EDITING = "startEditing",
  STOP_EDITING = "stopEditing",
}

export interface CellOptions {
  index: number;
  value: string;
  style?: CellColorSet;
  isBlocked: boolean;
  isPointerOn: boolean;
  isSelected: boolean;
  onClick?: () => void;
  onContextMenu: () => void;
  onKeyDown?: (cellValue: string, event: React.KeyboardEvent) => void;
}
