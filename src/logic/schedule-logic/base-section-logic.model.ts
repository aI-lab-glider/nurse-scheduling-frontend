import { DataRowHelper } from "../../helpers/data-row.helper";
import { Sections } from "../providers/schedule-provider.model";
import { DataRow } from "./data-row";

export abstract class BaseSectionLogic {
  abstract get sectionKey(): keyof Sections;

  addDataRow(newRow: DataRow): DataRow[] {
    this.sectionData = [...this.sectionData, newRow];
    return this.sectionData;
  }

  update(selectionMatrix: boolean[][], newValue: string): void {
    this.sectionData = DataRowHelper.copyWithReplaced(selectionMatrix, this.sectionData, newValue);
  }

  abstract get sectionData(): DataRow[];
  abstract set sectionData(dataRows: DataRow[]);
}
