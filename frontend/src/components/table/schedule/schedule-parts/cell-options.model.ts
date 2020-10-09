import { CellColorSet } from "../../../../helpers/colors/cell-color-set.model";
import { VerboseDate } from "../../../../logic/real-schedule-logic/month.logic";

export enum CellState {
  START_EDITING = "startEditing",
  STOP_EDITING = "stopEditing",
}

export interface CellOptions {
  index: number;
  value: string;
  className: string;
  verboseDate?: VerboseDate;
  isEditable?: boolean;
  onDataChanged?: (newValue: string) => void;
  onStateChange?: (state: CellState) => void;
  onContextMenu?: (cellIndex: number, isEditable: boolean) => void;
  pushToRow?: (index: number) => void;
  isSelected?: boolean;
  style?: CellColorSet;
}
