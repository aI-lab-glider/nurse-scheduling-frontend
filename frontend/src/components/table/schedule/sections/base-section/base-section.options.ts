import { DataRow } from "../../../../../logic/real-schedule-logic/data-row";
import { CellOptions } from "../../schedule-parts/cell-options.model";

export interface BaseSectionOptions {
  data?: DataRow[];
  cellComponent?: (cellOptions: CellOptions) => JSX.Element;
  sectionKey?: string;
}
