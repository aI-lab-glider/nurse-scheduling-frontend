export interface DataRowModel {
  rowKey: string;
  rowData: (includeNulls: boolean, includeKey: boolean) => any[];
}
