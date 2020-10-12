export enum ScheduleErrorLevel {
  INFO = "info",
  WARNING = "warning",
  CRITICAL_ERROR = "error",
}
export interface ScheduleErrorMessageModel {
  code: string;
  message: string;
  worker?: string;
  day?: number;
  week?: number;
  level: ScheduleErrorLevel;
}
