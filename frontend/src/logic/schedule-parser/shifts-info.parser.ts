import { ShiftCode } from "../../state/models/schedule-data/shift-info.model";
import { ShiftsProvider } from "../schedule-provider";
import { DataRowParser } from "./data-row.parser";
import { MetaDataParser } from "./metadata.parser";

export class ShiftsInfoParser implements ShiftsProvider {
  //#region  members
  private rowByKeys: { [key: string]: DataRowParser } = {};

  constructor(scheduleInfoSection: DataRowParser[], private metaData: MetaDataParser) {
    let data = scheduleInfoSection.map((row) => {
      row.processRow(this.fillRowWithShifts);
      // lastSundayData + 1 because slice not include last index
      row.cropData(this.metaData.validaDataStart, this.metaData.validaDataEnd + 1);
      return row;
    });
    data.forEach((row) => {
      this.rowByKeys[row.rowKey] = row;
    });
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
        [row.rowKey]: this.fillRowWithShifts(row.rowData(true)),
      }))
      .reduce((prev, curr) => ({ ...prev, ...curr }));
  }

  //#endregion

  //#region parser
  private static getShiftFromCell(cell: string): ShiftCode | null {
    return ShiftCode[cell?.trim().slice(0,2).trim()];
  }

  private fillRowWithShifts(row: string[]): ShiftCode[] {
    const continuousShifts = [ShiftCode.L4, ShiftCode.U]; 
    let previousShift: ShiftCode = ShiftCode.W;
    return row.map((c) => {
      let currentShift = ShiftsInfoParser.getShiftFromCell(c);
      if (currentShift == null) {
        currentShift = continuousShifts.includes(previousShift) ? previousShift : ShiftCode.W;
      }
      previousShift = currentShift
      return currentShift;
    });
  }


  //#endregion
}
