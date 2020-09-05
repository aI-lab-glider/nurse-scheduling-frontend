import { StringHelper } from "../../helpers/string.helper";

export class DataRow {
  constructor(private dataRow: Object) {}

  get isEmpty() {
    return this.asValueArray().length === 0;
  }
  get key() {
    if (this.isEmpty) {
      throw new Error("Trying to access key from an empty row");
    }
    return StringHelper.getRawValue(this.asValueArray()[0]);
  }

  public data(includeNulls = false) {
    if (this.isEmpty) {
      throw new Error("Trying to access key from an empty row");
    }
    let key_position = 1;
    return this.asValueArray(includeNulls).slice(key_position);
  }

  matchesRowKey(value: string, strict: boolean = false) {
    return strict
      ? !this.isEmpty && this.key === value
      : !this.isEmpty && StringHelper.getRawValue(this.key) === StringHelper.getRawValue(value);
  }

  findValue(key) {
    let data = this.asValueArray().find((cell) => StringHelper.includesEquvivalent(cell, key));
    data = StringHelper.getRawValue(data);
    key = StringHelper.getRawValue(key);
    return StringHelper.getRawValue(data.replace(key, ""));
  }

  findValues(...args: string[]): string[] {
    return args.map((arg) => this.findValue(arg));
  }

  asValueArray(includeNulls = false): string[] {
    return Object.values(this.dataRow).filter((cell) => cell != null || includeNulls);
  }
}
