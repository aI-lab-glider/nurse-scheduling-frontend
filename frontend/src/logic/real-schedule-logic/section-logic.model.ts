import { DataRow } from "./data-row";

export interface SectionLogic {
  sectionKey: string;
  updateDataRow(rowIndex: number, updateIndexes: number[], newValue: string): DataRow;
  sectionData: DataRow[];
}

export abstract class BaseSectionLogic implements SectionLogic {
  abstract sectionKey: string;

  updateDataRow(rowIndex: number, updateIndexes: number[], newValue: string): DataRow {
    const updatedDataRow = this.sectionData[rowIndex].updateData((data) => {
      updateIndexes.forEach((ind) => (data[ind] = newValue));
      return data;
    });
    return updatedDataRow;
  }
  abstract get sectionData(): DataRow[];
}
