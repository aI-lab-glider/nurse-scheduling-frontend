/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import { DataRowModel } from "../common-models/data-row.model";
import { DataRow } from "../logic/schedule-logic/data-row";
import { ArrayHelper } from "./array.helper";

export class DataRowHelper {
  public static dataRowsAsValueDict<T>(
    dataRows: DataRowModel[],
    includeNulls = false
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

  public static updateDataRowIndices(
    dataRow: DataRow,
    updateIndexes: number[],
    newValue: string
  ): DataRow {
    return dataRow.updateData((data) => {
      updateIndexes.forEach((ind) => (data[ind] = newValue));
      return data;
    });
  }

  public static copyWithReplaced<TData>(
    booleanMatrix: boolean[][],
    source: DataRow<TData>[],
    newValue: TData
  ): DataRow<TData>[] {
    const copy = source.map(DataRowHelper.deepCopy);
    copy.forEach((row, rowInd) => {
      row.updateData((data) =>
        data.map((cellValue, cellInd) => {
          if (booleanMatrix[rowInd][cellInd]) {
            return newValue;
          }
          return cellValue;
        })
      );
    });
    return copy;
  }

  public static deepCopy<TData = string>(dataRow: DataRow<TData>): DataRow<TData> {
    return new DataRow(dataRow.rowKey, [...dataRow.rowData(true)]);
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
