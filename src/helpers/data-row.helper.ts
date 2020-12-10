import { DataRowModel } from "../common-models/data-row.model";
import { DataRow } from "../logic/schedule-logic/data-row";
import { ArrayHelper } from "./array.helper";

export class DataRowHelper {
  public static dataRowsAsValueDict<T>(
    dataRows: DataRowModel[],
    includeNulls: boolean
  ): { [key: string]: T[] } {
    return ArrayHelper.arrayToObject<DataRowModel, T[]>(
      dataRows,
      (row) => row.rowKey,
      (key, dataRow) => dataRow.rowData(includeNulls, false)
    );
  }

  public static dataRowsAsDataRowDict<T extends DataRowModel>(dataRows: T[]): { [key: string]: T } {
    return ArrayHelper.arrayToObject(
      dataRows,
      (item) => item.rowKey,
      (key, row) => row
    );
  }
  public static updateDataRowsIndicies(
    dataRows: DataRow[],
    rowIndex: number,
    updateIndexes: number[],
    newValue: string
  ): DataRow {
    return dataRows[rowIndex].updateData((data) => {
      updateIndexes.forEach((ind) => (data[ind] = newValue));
      return data;
    });
  }
  public static areDataRowsEqual(dataRow1: DataRow, dataRow2: DataRow): boolean {
    const rowData1 = dataRow1.rowData(true, true);
    const rowData2 = dataRow2.rowData(true, true);
    return ArrayHelper.arePrimitiveArraysEqual(rowData1, rowData2);
  }

  public static areDataRowArraysEqual(
    dataRowArray1: DataRow[] = [],
    dataRowArray2: DataRow[] = []
  ): boolean {
    if (dataRowArray1.length !== dataRowArray2.length) return false;
    for (let ind = 0; ind < dataRowArray1.length; ++ind) {
      if (!DataRowHelper.areDataRowsEqual(dataRowArray1[ind], dataRowArray2[ind])) return false;
    }
    return true;
  }
}
