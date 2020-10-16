import { DataRow } from "../logic/schedule-logic/data-row";
import { DataRowModel } from "../state/models/data-row.model";
import { arrayToObject } from "./array.helper";

export class DataRowHelper {
  public static dataRowsAsValueDict<T>(
    dataRows: DataRowModel[],
    includeNulls: boolean
  ): { [key: string]: T[] } {
    return arrayToObject<DataRowModel, T[]>(
      dataRows,
      (row) => row.rowKey,
      (key, dataRow) => dataRow.rowData(includeNulls, false)
    );
  }

  public static dataRowsAsDataRowDict<T extends DataRowModel>(dataRows: T[]) {
    return arrayToObject(
      dataRows,
      (item) => item.rowKey,
      (key, row) => row
    );
  }
}
