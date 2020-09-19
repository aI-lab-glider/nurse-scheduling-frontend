import { DataRow } from "../../../../../logic/real-schedule-logic/data-row";
import { SectionLogic } from "../../../../../logic/real-schedule-logic/section-logic.model";
import { CellOptions } from "../../schedule-parts/cell-options.model";

export interface BaseSectionOptions {
  data?: DataRow[];
  onSectionUpdated: (sectionData: DataRow[]) => void;
  logic?: SectionLogic;
  cellComponent?: (cellOptions: CellOptions) => JSX.Element;
}
