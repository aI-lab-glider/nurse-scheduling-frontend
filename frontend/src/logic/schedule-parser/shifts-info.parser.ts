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

  private fillRowWithShifts(row: string[]): ShiftCode[] {
    let previousShift: ShiftCode | null = null;
    return row.map((i) => {
      // required to handle notes with notes, such as:
      // U (urlop wypoczynkowy za 2016,11dni,88godzin  /5.08-22.08.2016 )
      // in that case, we should take 2 first values, because they correspond to actual shift
      i = i?.trim().slice(0,2).trim();
      if (!i || i === ShiftCode.Wildcard) {
        return previousShift || ShiftCode.W;
      }
      switch (i) {
        case ShiftCode.L4:
          previousShift = previousShift === ShiftCode.L4 ? null : ShiftCode.L4;
          break;
        case ShiftCode.U:
          previousShift = previousShift === ShiftCode.U ? null : ShiftCode.U;
          break;
        default:
          previousShift = null;
          break;
      }
      return previousShift || (ShiftCode[i] ?? ShiftCode.W); // if shift code is not recognized, consider it as W 
    });
  }
  //#endregion
}
