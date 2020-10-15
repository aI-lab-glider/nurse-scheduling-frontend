import { DataRow } from "../../../../../logic/real-schedule-logic/data-row";
import { CellOptions } from "../../schedule-parts/cell-options.model";
import { ScheduleRowOptions } from "../../schedule-parts/schedule-row.component";
import { ShiftRowOptions } from "../../schedule-parts/shift-row.component";

export interface BaseSectionOptions {
  data?: DataRow[];
  cellComponent?: (cellOptions: CellOptions) => JSX.Element;
  rowComponent?: React.FC<ShiftRowOptions>;
  sectionKey?: string;
  onRowKeyClicked?: (rowIndex: number) => void;
}
