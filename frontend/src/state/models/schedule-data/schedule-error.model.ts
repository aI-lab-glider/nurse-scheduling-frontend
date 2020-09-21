import { Shift } from "./shift-info.model";

export type DayTime = "MORNING" | "AFTERNOON" | "NIGHT";

export interface ScheduleErrorModel {
  code: string;
  worker?: string;
  week?: number;
  actual?: number;
  required?: number;
  hours?: number;
  day?: number;
  day_time?: DayTime;
  preceding?: Shift;
  succeeding?: Shift;
}
