export enum EmploymentType {
  FULL = "FULL",
  HALF = "HALF",
}

export enum EmployeeRole {
  NURSE = "pielęgniarka",
  BABYSITTER = "opiekunka",
}
export interface EmployeeInfoModel {
  time: EmploymentType;
}
