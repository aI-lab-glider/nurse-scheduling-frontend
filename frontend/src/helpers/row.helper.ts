import { DataRowModel } from "../state/models/data-row.model";

export class DataRowHelper {
  public static dataRowsAsValueDict<T>(
    dataRows: DataRowModel[],
    includeNulls: boolean
  ): { [key: string]: T[] } {
    return dataRows
      .map((r) => ({ [r.rowKey]: r.rowData(includeNulls, false) }))
      .reduce((acc, curr) => ({ ...acc, ...curr }), {});
  }
}
