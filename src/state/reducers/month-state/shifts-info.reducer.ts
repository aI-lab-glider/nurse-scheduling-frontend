import { ShiftInfoModel } from "../../../common-models/shift-info.model";
import { scheduleDataInitialState } from "./schedule-data/schedule-data-initial-state";
import { ScheduleActionType } from "./schedule-data/temporary-schedule.reducer";
import { ScheduleActionModel } from "./schedule-data/schedule-data.action-creator";
import { copyShiftstoMonth, createActionName } from "./schedule-data/common-reducers";

export function scheduleShiftsInfoReducerF(name: string) {
  return (
    state: ShiftInfoModel = scheduleDataInitialState.shifts,
    action: ScheduleActionModel
  ): ShiftInfoModel => {
    const data = action.payload?.shifts;
    switch (action.type) {
      case createActionName(name, ScheduleActionType.ADD_NEW):
      case createActionName(name, ScheduleActionType.UPDATE):
        return { ...data };
      case createActionName(name, ScheduleActionType.COPY_FROM_MONTH):
        // eslint-disable-next-line @typescript-eslint/camelcase
        const { month_number, year } = (action.payload as unknown) as {
          month_number: number;
          year: number;
        };
        return copyShiftstoMonth(month_number, year, state);

      default:
        return state;
    }
  };
}
