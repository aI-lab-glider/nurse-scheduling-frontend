import { ShiftCode } from "./shift-info.model";

export enum AlgorithmErrorCode {
  AON = "AON",
  WND = "WND",
  WNN = "WNN",
  DSS = "DSS",
  LLB = "LLB",
  WUH = "WUH",
  WOH = "WOH",
}

export enum ParseErrorCode {
  UNKNOWN_VALUE = "unknownSymbol",
}

export type DayTime = "MORNING" | "AFTERNOON" | "NIGHT";

export interface ScheduleErrorModel {
  code: AlgorithmErrorCode | ParseErrorCode;
  worker?: string;
  week?: number;
  actual?: string | number;
  required?: number;
  hours?: number;
  day?: number;
  day_time?: DayTime;
  preceding?: ShiftCode;
  succeeding?: ShiftCode;
}
