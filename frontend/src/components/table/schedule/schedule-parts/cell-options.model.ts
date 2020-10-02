export enum CellState {
  START_EDITING = "startEditing",
  STOP_EDITING = "stopEditing",
}

export interface CellOptions {
  index: number;
  value: string;
  className: string;
  dayType?: string;
  isEditable?: boolean;
  onDataChanged?: (newValue: string) => void;
  onStateChange?: (state: CellState) => void;
  onContextMenu?: (cellIndex: number, isEditable: boolean) => void;
  pushToRow?: (index: number) => void;
  isSelected?: boolean;
}
