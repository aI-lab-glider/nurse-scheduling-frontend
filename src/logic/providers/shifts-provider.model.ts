import { ScheduleError } from "../../common-models/schedule-error.model";
import { ShiftCode } from "../../common-models/shift-info.model";

export abstract class ShiftsProvider {
  abstract get errors(): ScheduleError[];
  abstract get workerShifts(): { [workerName: string]: ShiftCode[] };
  abstract get availableWorkersWorkTime(): { [key: string]: number };
  abstract get workersCount(): number;
  get workers(): string[] {
    return [];
  }
}
