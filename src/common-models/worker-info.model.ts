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

export interface WorkersInfoModel {
  time: { [key: string]: number };
  type: { [workerName: string]: WorkerType };
}

export interface WorkerInfoModel {
  name: string;
  time: number;
  type?: WorkerType;
  shifts?: [VerboseDate, ShiftCode][];
  requiredHours?: number;
  overtime?: number;
}
