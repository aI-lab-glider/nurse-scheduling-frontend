import { DataRowModel } from "../../state/models/data-row.model";

export class DataRow implements DataRowModel {
  constructor(private key: string, private data: any[] = []) {}

  public get isEmpty() {
    return this.data.filter((i) => i !== null).length === 0;
  }

  public get rowKey() {
    return this.key;
  }

  public rowData(includeNulls = false, includeKey = false) {
    let filteredRow = this.data.filter((c) => includeNulls || c != null);
    return includeKey ? [this.key, ...filteredRow] : filteredRow;
  }

  public updateData(updateCallback: (row: string[]) => any[]) {
    let data = this.rowData(true, false);
    this.data = updateCallback(data);
  }

  public setValue(index: number, value: string) {
    let data = this.rowData(true, false);
    data[index] = value;
    this.data = [...data];
  }

  public get length() {
    // data + key
    return this.data.length + 1
  }
}
