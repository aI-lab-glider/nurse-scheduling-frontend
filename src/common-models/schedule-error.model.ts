/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import { ShiftCode } from "./shift-info.model";

export type GroupedScheduleErrors = {
  [key in ErrorCode]?: ScheduleError[];
};

export type ErrorCode = AlgorithmErrorCode | ParseErrorCode | InputFileErrorCode;

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
  NO_BABYSITTER_SECTION = "NO_BABYSITTER_SECTION",
  NO_NURSE_SECTION = "NO_NURSE_SECTION",
  NO_CHILDREN_SECTION = "NO_CHILDREN_SECTION",
  INVALID_METADATA = "INVALID_METADATA",
  NO_CHILDREN_QUANTITY = "NO_CHILDREN_QUANTITY",
}

export enum NetworkErrorCode {
  NETWORK_ERROR = "NETWORK_ERROR",
}

export type ScheduleError = UnknownValueError | InputFileError | AlgorithmError | NetworkError;

interface UnknownValueError {
  kind: ParseErrorCode.UNKNOWN_VALUE;
  actual: string;
  day?: number;
  worker?: string;
}

interface InputFileError {
  kind: InputFileErrorCode;
}

export interface NetworkError {
  kind: NetworkErrorCode;
}

export type DayTime = "MORNING" | "AFTERNOON" | "NIGHT";

export type AlgorithmError =
  | AlwaysAtLeastOneNurse
  | WorkerNumberDuringDay
  | WorkerNumberDuringNight
  | DissalowedShiftSequence
  | LackingLongBreak
  | WorkerUnderTime
  | WorkerOvertime;
export interface AlwaysAtLeastOneNurse {
  kind: AlgorithmErrorCode.AlwaysAtLeastOneNurse;
  day: number;
  day_time: number;
}

export interface WorkerNumberDuringDay {
  kind: AlgorithmErrorCode.WorkerNumberDuringDay;
  day: number;
  required: number;
  actual: number;
}
export interface WorkerNumberDuringNight {
  kind: AlgorithmErrorCode.WorkerNumberDuringNight;
  day: number;
  required: number;
  actual: number;
}
export interface DissalowedShiftSequence {
  kind: AlgorithmErrorCode.DissalowedShiftSequence;
  day: number;
  worker: string;
  preceding: ShiftCode[];
  succeeding: ShiftCode[];
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
