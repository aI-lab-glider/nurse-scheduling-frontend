export interface ScheduleModel {
  UUID?: string;
  month_number: number;
  year: number;
  daysFromPreviousMonthExists: boolean;
  isInitialized?: boolean;
}
