/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import { ShiftCode } from "./shift-info.model";

export enum AlgorithmErrorCode {
  AlwaysAtLeastOneNurse = "AON",
  WorkerNumberDuringDay = "WND",
  WorkerNumberDuringNight = "WNN",
  DissalowedShiftSequence = "DSS",
  LackingLongBreak = "LLB",
  WorkerUnderTime = "WUH",
  WorkerOvertime = "WOH",
}

export enum ParseErrorCode {
  UNKNOWN_VALUE = "unknownSymbol",
}

export enum InputFileErrorCode {
  EMPTY_FILE = "EMPTY_FILE",
  LOAD_FILE_ERROR = "LOAD_FILE_ERROR",
  UNHANDLED_FILE_EXTENSION = "UNHANDLED_FILE_EXTENSION",
}

export enum NetworkErrorCode {
  NETWORK_ERROR = "NETWORK_ERROR",
}

interface UnknownValueError {
  kind: ParseErrorCode.UNKNOWN_VALUE;
  actual: string;
  day?: number;
  worker?: string;
}

interface InputFileError {
  kind: InputFileErrorCode;
  message?: string;
  filename?: string;
}

export interface NetworkError {
  kind: NetworkErrorCode;
}

//#region  alghorithm errors

export type DayTime = "MORNING" | "AFTERNOON" | "NIGHT";

export interface AlwaysAtLeastOneNurse {
  kind: AlgorithmErrorCode.AlwaysAtLeastOneNurse;
  day: number;
  day_time: number;
  segments: [[number, number]];
}

export interface WorkerNumberDuringDay {
  kind: AlgorithmErrorCode.WorkerNumberDuringDay;
  day: number;
  required: number;
  actual: number;
  segments: [[number, number]];
}
export interface WorkerNumberDuringNight {
  kind: AlgorithmErrorCode.WorkerNumberDuringNight;
  day: number;
  required: number;
  actual: number;
  segments: [[number, number]];
}
export interface DissalowedShiftSequence {
  kind: AlgorithmErrorCode.DissalowedShiftSequence;
  day: number;
  worker: string;
  preceding: ShiftCode;
  succeeding: ShiftCode;
}
export interface LackingLongBreak {
  kind: AlgorithmErrorCode.LackingLongBreak;
  week: number;
  worker: string;
}
export interface WorkerUnderTime {
  kind: AlgorithmErrorCode.WorkerUnderTime;
  hours: number;
  worker: string;
}
export interface WorkerOvertime {
  kind: AlgorithmErrorCode.WorkerOvertime;
  hours: number;
  worker: string;
}

//#endregion

export type AlgorithmError =
  | AlwaysAtLeastOneNurse
  | WorkerNumberDuringDay
  | WorkerNumberDuringNight
  | DissalowedShiftSequence
  | LackingLongBreak
  | WorkerUnderTime
  | WorkerOvertime;

export type ScheduleError = UnknownValueError | InputFileError | NetworkError | AlgorithmError;

export type ErrorCode = ParseErrorCode | InputFileErrorCode;

export type GroupedScheduleErrors = {
  [key in ErrorCode]?: ScheduleError[];
} & {
  [AlgorithmErrorCode.AlwaysAtLeastOneNurse]?: AlwaysAtLeastOneNurse[];
  [AlgorithmErrorCode.WorkerNumberDuringDay]?: WorkerNumberDuringDay[];
  [AlgorithmErrorCode.WorkerNumberDuringNight]?: WorkerNumberDuringNight[];
  [AlgorithmErrorCode.DissalowedShiftSequence]?: DissalowedShiftSequence[];
  [AlgorithmErrorCode.LackingLongBreak]?: LackingLongBreak[];
  [AlgorithmErrorCode.WorkerUnderTime]?: WorkerUnderTime[];
  [AlgorithmErrorCode.WorkerOvertime]?: WorkerOvertime[];
};
