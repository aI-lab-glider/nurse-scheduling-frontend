import { DataRowModel } from "../common-models/data-row.model";
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
}
