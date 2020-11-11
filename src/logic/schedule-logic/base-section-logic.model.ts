import { Sections } from "../providers/schedule-provider.model";
import { DataRow } from "./data-row";

export abstract class BaseSectionLogic {
  abstract get sectionKey(): keyof Sections;

  addDataRow(newRow: DataRow): DataRow[] {
    this.sectionData = [...this.sectionData, newRow];
    return this.sectionData;
  }

  updateDataRow(rowIndex: number, updateIndexes: number[], newValue: string): DataRow {
    return this.sectionData[rowIndex].updateData((data) => {
      updateIndexes.forEach((ind) => (data[ind] = newValue));
      return data;
    });
  }
  abstract get sectionData(): DataRow[];
  abstract set sectionData(dataRows: DataRow[]);
}
