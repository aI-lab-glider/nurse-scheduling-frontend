export enum CellState {
  START_EDITING = "startEditing",
  STOP_EDITING = "stopEditing",
}
export interface CellOptions {
  value: string;
  className: string;
  dayType?: string;
  isEditable?: boolean;
  onDataChanged?: (newValue: string) => void;
  onStateChange?: (state: CellState) => void;
}
