export interface ScheduleErrorMessageModel {
  code: string;
  message: string;
  worker?: string;
  day?: number;
  week?: number;
}
