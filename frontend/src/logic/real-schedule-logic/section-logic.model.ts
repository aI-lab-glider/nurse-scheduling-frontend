import { DataRow } from "./data-row";

export interface SectionLogic {
  tryUpdate(dataRow: DataRow);
  sectionData: DataRow[];
}
