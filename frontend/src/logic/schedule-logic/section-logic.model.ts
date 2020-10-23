import { DataRow } from "./data-row";

export interface SectionLogic {
  sectionKey: string;
  addDataRow(newRow: DataRow): DataRow[];
  updateDataRow(rowIndex: number, updateIndexes: number[], newValue: string): DataRow;
  sectionData: DataRow[];
}

export abstract class BaseSectionLogic implements SectionLogic {
  abstract sectionKey: string;

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
