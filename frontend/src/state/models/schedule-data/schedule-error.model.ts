export interface ScheduleErrorModel {
  code: string;
  worker?: string;
  week?: number;
  actual?: number;
  required?: number;
}
