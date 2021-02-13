import { baseRowDataCy } from "../schedule-page/table/schedule/schedule-parts/base-row.models";

export const summaryRowDataCy = (cellIndex: number): string => baseRowDataCy(cellIndex);
export interface SummaryTableRowOptions {
  uuid: string;
  data: number[];
  rowIndex: number;
}
