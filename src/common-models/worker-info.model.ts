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

export interface WorkersInfoModel {
  time: { [key: string]: number };
  type: { [workerName: string]: WorkerType };
}

export interface WorkerInfoModel {
  name: string;
  time: number;
  type?: WorkerType;
  requiredHours?: number;
  overtime?: number;
}
