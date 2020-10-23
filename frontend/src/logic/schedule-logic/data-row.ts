import { DataRowModel } from "../../state/models/data-row.model";

export class DataRow implements DataRowModel {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  constructor(private key: string, private data: any[] = []) {}

  public get isEmpty() {
    return this.data.filter((i) => i !== null).length === 0;
  }

  public get rowKey() {
    return this.key;
  }

  public rowData(includeNulls = false, includeKey = false) {
    const filteredRow = this.data.filter((c) => includeNulls || c != null);
    return includeKey ? [this.key, ...filteredRow] : filteredRow;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public updateData(updateCallback: (row: string[]) => any[]): DataRow {
    const data = this.rowData(true, false);
    this.data = updateCallback(data);
    return this;
  }

  public setValue(indexes: number[], value: string) {
    const data = this.rowData(true, false);
    for (const index of indexes) {
      data[index] = value;
    }
    this.data = [...data];
  }

  public get length() {
    // data + key
    return this.data.length + 1;
  }
}
