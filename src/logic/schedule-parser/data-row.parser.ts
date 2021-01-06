/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import { StringHelper } from "../../helpers/string.helper";
import { ShiftCode } from "../../common-models/shift-info.model";

export class DataRowParser {
  private data: string[];
  public isShiftRow: boolean;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  constructor(data: Record<string, any>) {
    this.data = Object.values(data).map((x) => x?.toString() || null);
    this.isShiftRow = this.checkShiftRowPattern();
  }

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

  private checkShiftRowPattern(): boolean {
    const containsNotEmptyKey = this.data[0] !== null && this.data[0] !== "";

    const containsShiftCode = this.data.filter((c) => c in ShiftCode).length !== 0;

    // TODO: Validate constraint with new schedules
    const dataLen = this.data.length;
    const hoursCellsNumber = 3;
    if (this.data.length < hoursCellsNumber) {
      return false;
    }
    let containsHoursInfo = true;
    for (let i = 1; i < hoursCellsNumber + 1; i++) {
      if (typeof parseInt(this.data[dataLen - i]) !== "number") {
        containsHoursInfo = false;
      }
    }

    return containsNotEmptyKey && containsShiftCode && containsHoursInfo;
  }
}
