/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import { VerboseDate } from "./month-info.model";
import { ShiftCode } from "./shift-info.model";
import * as _ from "lodash";

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

  static translateToShort(type: WorkerType): string {
    switch (type) {
      case WorkerType.NURSE:
        return "P";
      case WorkerType.OTHER:
        return "O";
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

  static translateToShort(type: ContractType): string {
    switch (type) {
      case ContractType.EMPLOYMENT_CONTRACT:
        return "UoP";
      case ContractType.CIVIL_CONTRACT:
        return "UZ";
    }
  }
}

export enum TimeDrawerType {
  FULL = "1/1",
  HALF = "1/2",
  OTHER = "inne",
}

export interface WorkersInfoModel {
  time: { [key: string]: number };
  type: { [workerName: string]: WorkerType };
  contractType?: { [workerName: string]: ContractType };
}

export interface WorkerDescription {
  name: string;
  time: number;
  type: WorkerType;
  contractType: ContractType;
}

export interface WorkerInfoModel {
  name: string;
  time: number;
  type?: WorkerType;
  shifts?: [VerboseDate, ShiftCode][];
}

export function validateEmployeeInfo(employeeInfo: WorkersInfoModel): void {
  const workersWithType = _.sortBy(Object.keys(employeeInfo.type));
  const workersWithTime = _.sortBy(Object.keys(employeeInfo.time));
  // TODO: make contract type required

  //   const workersWithContractType = _.sortBy(Object.keys(employeeInfo.contractType));
  //   if (!_.isEqual(workersWithType, workersWithContractType)) {
  //     throw new Error(
  //       `Contract type cannot be defined for workers without defined type. Workers without defined contract type are
  //        ${workersWithType.filter((w) => !workersWithContractType.includes(w)).join(", ")}`
  //     );
  //   }
  // }

  if (!_.isEqual(workersWithType, workersWithTime)) {
    throw new Error(
      `Working time cannot be defined for workers without defined type. Workers without defined time are
         ${workersWithType.filter((w) => !workersWithTime.includes(w)).join(", ")}`
    );
  }
}
