export enum WorkerType {
  NURSE = "NURSE",
  OTHER = "OTHER",
}

export interface EmployeeInfoModel {
  nurseCount: number;
  babysitterCount: number;
  type: { [workerName: string]: WorkerType[] };
}
