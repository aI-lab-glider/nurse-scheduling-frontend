import { StringHelper } from "../../helpers/string.helper";
import { ShiftCode } from "../../state/models/schedule-data/shift-info.model";

export class DataRowParser {
  private data: string[];
  public isShiftRow: boolean;

  constructor(data: Object) {
    this.data = Object.values(data).map((x) => x?.toString() || null);
    this.isShiftRow = this.checkShiftRowPattern();
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

  public set rowKey(value: string) {
    if (this.data) {
      this.data[0] = value;
    } else {
      this.data = [value];
    }
  }

  public rowData(includeNulls = false, includeKey = false) {
    const keyPosition = 1;
    return includeKey
      ? this.data.filter((c) => includeNulls || c != null)
      : this.data.filter((c) => includeNulls || c != null).slice(keyPosition);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public processRow(processingFunction: (row: DataRowParser) => any[]): DataRowParser {
    const rowKey = this.rowKey;
    const data = [rowKey, ...processingFunction(this)];
    return new DataRowParser(data);
  }

  public cropData(from: number, to: number): DataRowParser {
    const key = this.rowKey;
    const data = [key, ...this.rowData(true, false).slice(from, to)];
    return new DataRowParser(data);
  }

  public findValue(key: string) {
    let data = this.data.find((cell) => StringHelper.includesEquvivalent(cell, key));
    data = StringHelper.getRawValue(data);
    key = StringHelper.getRawValue(key);
    return StringHelper.getRawValue(data.replace(key, ""));
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
