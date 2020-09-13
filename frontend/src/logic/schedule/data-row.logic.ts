import { StringHelper } from "../../helpers/string.helper";

export class DataRow {
  private data: string[];

  constructor(data: Object) {
    this.data = Object.values(data);
  }

  public get isEmpty() {
    return this.rowData(false, true).length === 0;
  }

  public get rowKey() {
    if (this.isEmpty) {
      throw new Error("Trying to access key from an empty row");
    }
    return StringHelper.getRawValue(this.rowData(false, true)[0]);
  }

  public rowData(includeNulls = false, includeKey = false) {
    let key_position = 1;
    return includeKey
      ? this.data.filter((c) => includeNulls || c != null)
      : this.data.filter((c) => includeNulls || c != null).slice(key_position);
  }

  public updateData(updateCallback: (row: string[]) => any[]) {
    let rowKey = this.rowKey;
    let rowContent = this.rowData(true);
    this.data = [rowKey, ...updateCallback(rowContent)];
  }

  public cropData(from: number, to: number) {
    let key = this.rowKey;
    this.data = [key, ...this.rowData(true, false).slice(from, to)];
  }

  matchesRowKey(value: string, strict: boolean = false) {
    return strict
      ? !this.isEmpty && this.rowKey === value
      : !this.isEmpty && StringHelper.getRawValue(this.rowKey) === StringHelper.getRawValue(value);
  }

  findValue(key: string) {
    let data = this.data.find((cell) => StringHelper.includesEquvivalent(cell, key));
    data = StringHelper.getRawValue(data);
    key = StringHelper.getRawValue(key);
    return StringHelper.getRawValue(data.replace(key, ""));
  }

  findValues(...args: string[]): string[] {
    return args.map((arg) => this.findValue(arg));
  }
}
