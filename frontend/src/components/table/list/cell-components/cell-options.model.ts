export enum CellState {
  START_EDITING = "startEditing",
  STOP_EDITING = "stopEditing",
}
export interface CellOptions {
  value: string;
  className: string;
  isEditable?: boolean;
  onDataChange?: (newValue: string) => void;
  onStateChange?: (state: CellState) => void;
}
