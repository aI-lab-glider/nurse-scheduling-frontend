import { DataRow } from "../../../../../logic/schedule-logic/data-row";
import { BaseCellOptions } from "../../schedule-parts/base-cell-options.model";
import { ShiftRowOptions } from "../../schedule-parts/shift-row.component";

export interface BaseSectionOptions {
  uuid: string;
  data?: DataRow[];
  cellComponent?: (BaseCellOptions: BaseCellOptions) => JSX.Element;
  rowComponent?: React.FC<ShiftRowOptions>;
  sectionKey?: string;
  onRowKeyClicked?: (rowIndex: number) => void;
}
