export interface DataRowModel {
  rowKey: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  rowData: (includeNulls: boolean, includeKey: boolean) => any[];
}
