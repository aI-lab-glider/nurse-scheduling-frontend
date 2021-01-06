export enum ScheduleErrorLevel {
  INFO = "info",
  WARNING = "warning",
  CRITICAL_ERROR = "error",
}
export interface ScheduleErrorMessageModel {
  kind: string;
  title?: string;
  message: string;
  worker?: string;
  day?: number;
  week?: number;
  level?: ScheduleErrorLevel;
}
