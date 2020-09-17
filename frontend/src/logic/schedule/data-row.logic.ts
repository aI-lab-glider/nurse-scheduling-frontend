import { StringHelper } from "../../helpers/string.helper";
import { ShiftCode } from "../../state/models/schedule-data/shift-info.model";

export class DataRow {
  private data: string[];
  public isShiftRow: boolean;

  constructor(data: Object) {
    this.data = Object.values(data);
    this.isShiftRow = this.checkShiftRowPattern()
  }

  //#public methods
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

  public setValue(index: number, value: string) {
    let key = this.rowKey;
    let data = this.rowData(true, false);
    data[index] = value;
    this.data = [key, ...data];
  }

  public matchesRowKey(value: string, strict: boolean = false) {
    return strict
      ? !this.isEmpty && this.rowKey === value
      : !this.isEmpty && StringHelper.getRawValue(this.rowKey) === StringHelper.getRawValue(value);
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
  //#endregion

  //# row check region
  private checkShiftRowPattern(): boolean {
    const containsNotEmptyKey = this.data[0] != null && this.data[0] != "";

    let shiftCodesList = Object.keys(ShiftCode)
        .map(k => ShiftCode[k as any])
    let containsAnyShiftCode = false;
    shiftCodesList.forEach(shift => {
      if(this.data.includes(shift)){
        containsAnyShiftCode = true;
      }
    })

    const dataLen = this.data.length
    const hoursCellsNumber = 3
    if(this.data.length < hoursCellsNumber){
      return false
    }
    let containsHoursInfo = true;
    for(let i = 1; i<hoursCellsNumber + 1; i++){
      if(typeof this.data[dataLen - i] !== 'number'){
        containsHoursInfo = false
      }
    }

    return containsNotEmptyKey &&
        containsAnyShiftCode &&
        containsHoursInfo
  }
  //#endregion

}
