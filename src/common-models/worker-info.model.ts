/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import { VerboseDate } from "./month-info.model";
import { ShiftCode } from "./shift-info.model";

export enum WorkerType {
  NURSE = "NURSE",
  OTHER = "OTHER",
}

export class WorkerTypeHelper {
  static translate(type: WorkerType, pluralize = false): string {
    switch (type) {
      case WorkerType.NURSE:
        return pluralize ? "pielęgniarki" : "pielęgniarka";
      case WorkerType.OTHER:
        return pluralize ? "opiekunki" : "opiekunka";
    }
  }
}

export enum ContractType {
  EMPLOYMENT_CONTRACT = "EMPLOYMENT_CONTRACT",
  CIVIL_CONTRACT = "CIVIL_CONTRACT",
}

export class ContractTypeHelper {
  static translate(type: ContractType): string {
    switch (type) {
      case ContractType.EMPLOYMENT_CONTRACT:
        return "umowa o pracę";
      case ContractType.CIVIL_CONTRACT:
        return "umowa zlecenie";
    }
  }
}

export enum TimeDrawerType {
  FULL = "1/1",
  HALF = "1/2",
  OTHER = "inne",
}

export interface WorkersInfoModel {
  time: { [key: string]: string | string[] | number };
  type: { [workerName: string]: WorkerType };
}

export interface WorkerInfoModel {
  name: string;
  time: string | string[] | number;
  type?: WorkerType;
  shifts?: [VerboseDate, ShiftCode][];
  requiredHours?: number;
  overtime?: number;
}
