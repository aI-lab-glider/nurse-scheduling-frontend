import { baseCellDataCy } from "../schedule-page/table/schedule/schedule-parts/base-cell/base-cell.models";

export interface SummaryTableCellOptions {
  value: number;
  cellIndex: number;
}

export const summaryCellDataCy = (index: number): string => baseCellDataCy(index, "cell");
