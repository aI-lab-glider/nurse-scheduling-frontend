import { DataRowHelper } from "../../helpers/data-row.helper";
import { Sections } from "../providers/schedule-provider.model";
import { DataRow } from "./data-row";

export abstract class BaseSectionLogic {
  abstract get sectionKey(): keyof Sections;

  addDataRow(newRow: DataRow): DataRow[] {
    this.sectionData = [...this.sectionData, newRow];
    return this.sectionData;
  }

  updateDataRow(rowIndex: number, updateIndices: number[], newValue: string): DataRow {
    return DataRowHelper.updateDataRowIndices(this.sectionData[rowIndex], updateIndices, newValue);
  }
  abstract get sectionData(): DataRow[];
  abstract set sectionData(dataRows: DataRow[]);
}
