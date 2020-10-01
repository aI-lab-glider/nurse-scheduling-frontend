export enum WorkerType {
  NURSE = "NURSE",
  OTHER = "OTHER",
}

export class WorkerTypeHelper {

  static translate(type: WorkerType, pluralize = false): string {
    switch(type) {
      case WorkerType.NURSE:
        return pluralize ? "pielęgniarki" : "pielęgniarka";
      case WorkerType.OTHER:
        return pluralize ? "opiekunki" : "opiekunka" 
    }
  }
}

export interface EmployeeInfoModel {
  time: { [key: string]: number };
  nurseCount: number;
  babysitterCount: number;
  type: { [workerName: string]: WorkerType[] };
}
