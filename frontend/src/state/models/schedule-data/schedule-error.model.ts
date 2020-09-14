export interface ScheduleErrorModel {
  code: string;
  worker?: string;
  week?: number;
  actual?: number;
  required?: number;
  hours?: number;
  day?: number;
  day_time?: any;
  preceding?: any;
  succeeding?: any;
}
