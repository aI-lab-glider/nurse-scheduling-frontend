import { DataRow } from "../logic/schedule/data-row.logic";

export interface SectionLogic {
  tryUpdate(row: DataRow);
}
