/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import { StringHelper } from "../../helpers/string.helper";

export class DataRowParser {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  constructor(private data: string[]) {}

  public get isEmpty(): boolean {
    return this.rowData(false, true).length === 0;
  }

  public get rowKey(): string {
    if (this.isEmpty) {
      throw new Error("Trying to access key from an empty row");
    }
    return StringHelper.getRawValue(this.rowData(false, true)[0]);
  }

  public set rowKey(value: string) {
    if (this.data) {
      this.data[0] = value;
    } else {
      this.data = [value];
    }
  }

  public rowData(includeNulls = false, includeKey = false): string[] {
    const keyPosition = 1;
    return includeKey
      ? this.data.filter((c) => includeNulls || c != null)
      : this.data.filter((c) => includeNulls || c != null).slice(keyPosition);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public createWithProcessedRow(processingFunction: (row: DataRowParser) => any[]): DataRowParser {
    const rowKey = this.rowKey;
    const data = [rowKey, ...processingFunction(this)];
    return new DataRowParser(data);
  }

  public createWithCroppedData(from: number, to: number): DataRowParser {
    const key = this.rowKey;
    const data = [key, ...this.rowData(true, false).slice(from, to)];
    return new DataRowParser(data);
  }

  public findValue(key: string): string {
    let data = this.data.find((cell) => StringHelper.includesEquivalent(cell, key));
    data = StringHelper.getRawValue(data);
    key = StringHelper.getRawValue(key);
    return StringHelper.getRawValue(data.replace(key, ""));
  }

  public includes(key: string): boolean {
    return this.data.includes(key);
  }

  public findValues(...args: string[]): string[] {
    return args.map((arg) => this.findValue(arg));
  }
}
