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

export enum InputFileErrorCode {
  EMPTY_FILE = "emptyFile",
  NO_CARETAKER_SECTION = "noCaretakerSection",
  NO_NURSE_SECTION = "noNurseSection",
  NO_CHILDREN_SECTION = "noChildrenSection",
  INVALID_METADATA = "invalidMetadata",
  NO_CHILDREN_QUANTITY = "noChildrenQuantity",
}

export type ScheduleError = UnknownValueError | InputFileError | AlgorithmError;

interface UnknownValueError {
  kind: ParseErrorCode.UNKNOWN_VALUE;
  actual: string;
  day?: number;
  worker?: string;
}

interface InputFileError {
  kind: InputFileErrorCode;
}

export type DayTime = "MORNING" | "AFTERNOON" | "NIGHT";

export interface AlgorithmError {
  kind: AlgorithmErrorCode;
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
