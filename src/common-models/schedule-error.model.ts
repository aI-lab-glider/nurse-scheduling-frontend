/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
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
  EMPTY_FILE = "EMPTY_FILE",
  NO_BABYSITTER_SECTION = "NO_BABYSITTER_SECTION",
  NO_NURSE_SECTION = "NO_NURSE_SECTION",
  NO_CHILDREN_SECTION = "NO_CHILDREN_SECTION",
  INVALID_METADATA = "INVALID_METADATA",
  NO_CHILDREN_QUANTITY = "NO_CHILDREN_QUANTITY",
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
