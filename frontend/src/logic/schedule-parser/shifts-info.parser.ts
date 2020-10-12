import {
  ParseErrorCode,
  ScheduleErrorModel,
} from "../../state/models/schedule-data/schedule-error.model";
import { ShiftCode } from "../../state/models/schedule-data/shift-info.model";
import { ShiftsProvider } from "../schedule-provider";
import { DataRowParser } from "./data-row.parser";
import { MetaDataParser } from "./metadata.parser";

export class ShiftsInfoParser implements ShiftsProvider {
  //#region  members
  private rowByKeys: { [key: string]: DataRowParser } = {};
  private _parseErrors: ScheduleErrorModel[] = [];

  constructor(scheduleInfoSection: DataRowParser[], private metaData: MetaDataParser) {
    let data = scheduleInfoSection.map((row) => {
      // lastSundayData + 1 because slice not include last index
      row.cropData(this.metaData.validaDataStart, this.metaData.validaDataEnd + 1);
      row.processRow((dataRow) => this.fillRowWithShifts(dataRow));
      return row;
    });
    data.forEach((row) => {
      this.rowByKeys[row.rowKey] = row;
    });
  }

  public get errors(): ScheduleErrorModel[] {
    return [...this._parseErrors];
  }

  //#endregion
  //#region logic
  public get sectionData(): DataRowParser[] {
    return this.data;
  }

  public mockEmployeeWorkTime(): { [key: string]: number } {
    let employeeDict = {};
    Object.keys(this.getWorkerShifts()).forEach((key) => (employeeDict[key] = 1.0));
    return employeeDict;
  }

  public get workersCount(): number {
    return this.data.length;
  }

  public get data() {
    return Object.values(this.rowByKeys);
  }

  public getWorkerShifts(): { [workerName: string]: ShiftCode[] } {
    return this.data
      .map((row) => ({
        [row.rowKey]: this.fillRowWithShifts(row),
      }))
      .reduce((prev, curr) => ({ ...prev, ...curr }));
  }

  //#endregion

  //#region parser
  private getShiftFromCell(cell: string): ShiftCode | null {
    return ShiftCode[cell?.trim().slice(0, 2).trim()];
  }

  private fillRowWithShifts(row: DataRowParser): ShiftCode[] {
    const continuousShifts = [ShiftCode.L4, ShiftCode.U];
    let previousShift: ShiftCode = ShiftCode.W;
    return row.rowData(true, false).map((cellValue, cellInd) => {
      let currentShiftValue = this.getShiftFromCell(cellValue);
      if (!currentShiftValue) {
        if (cellValue) {
          this._parseErrors.push({
            code: ParseErrorCode.UNKNOWN_SHIFT,
            day: this.metaData.dates[cellInd],
            worker: row.rowKey,
            actual: cellValue,
          });
        }
        currentShiftValue = continuousShifts.includes(previousShift) ? previousShift : ShiftCode.W;
      }
      previousShift = currentShiftValue;
      return currentShiftValue;
    });
  }

  //#endregion
}
