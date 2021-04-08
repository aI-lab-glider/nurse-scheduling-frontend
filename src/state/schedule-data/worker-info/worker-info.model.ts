/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import { VerboseDate } from "../foundation-info/foundation-info.model";
import { ShiftCode } from "../shifts-types/shift-types.model";
import * as _ from "lodash";
import { Opaque } from "../../../utils/type-utils";

export enum WorkerType {
  NURSE = "NURSE",
  OTHER = "OTHER",
}

export enum ContractType {
  EMPLOYMENT_CONTRACT = "EMPLOYMENT_CONTRACT",
  CIVIL_CONTRACT = "CIVIL_CONTRACT",
}

export enum TimeDrawerType {
  FULL = "1/1",
  HALF = "1/2",
  OTHER = "inne",
}

export type WorkerGroup = Opaque<string, "WorkerGroup">;
export interface WorkersInfoModel {
  time: { [key: string]: number };
  type: { [workerName: string]: WorkerType };
  contractType?: { [workerName: string]: ContractType };
  team: { [workerName: string]: WorkerGroup };
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
  contractType?: ContractType;
  type?: WorkerType;
  shifts?: [VerboseDate, ShiftCode][];
  workerGroup?: WorkerGroup;
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
         ${workersWithTime.filter((w) => !workersWithType.includes(w)).join(", ")}`
    );
  }
}
