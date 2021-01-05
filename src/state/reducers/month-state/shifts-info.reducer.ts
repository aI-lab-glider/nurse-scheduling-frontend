import { ShiftInfoModel } from "../../../common-models/shift-info.model";
import { scheduleDataInitialState } from "./schedule-data/schedule-data-initial-state";
import { TemporaryScheduleActionType } from "./schedule-data/temporary-schedule.reducer";
import { ScheduleActionModel } from "./schedule-data/schedule-data.action-creator";
import { copyShiftstoMonth } from "./schedule-data/common-reducers";
import { PersistentScheduleActionType } from "./schedule-data/persistent";

export function shiftsInfoReducer(
  state: ShiftInfoModel = scheduleDataInitialState.shifts,
  action: ScheduleActionModel
): ShiftInfoModel {
  const data = action.payload?.shifts;
  if (!data && action.type !== PersistentScheduleActionType.COPY_FROM_MONTH) return state;
  switch (action.type) {
    case TemporaryScheduleActionType.ADD_NEW:
      return { ...data };
    case TemporaryScheduleActionType.UPDATE:
      return { ...state, ...data };
    case PersistentScheduleActionType.COPY_FROM_MONTH:
      // eslint-disable-next-line @typescript-eslint/camelcase
      const { month_number, year } = (action.payload as unknown) as {
        month_number: number;
        year: number;
      };

      return copyShiftstoMonth(month_number, year, state);

    default:
      return state;
  }
}

export function persistenScheduletShiftsInfoReducer(
  state: ShiftInfoModel = scheduleDataInitialState.shifts,
  action: ScheduleActionModel
): ShiftInfoModel {
  const data = action.payload?.shifts;
  if (!data && action.type !== PersistentScheduleActionType.COPY_FROM_MONTH) return state;
  switch (action.type) {
    case PersistentScheduleActionType.SET_REVISION:
      return { ...data };
    case PersistentScheduleActionType.COPY_FROM_MONTH:
      // eslint-disable-next-line @typescript-eslint/camelcase
      const { month_number, year } = (action.payload as unknown) as {
        month_number: number;
        year: number;
      };

      return copyShiftstoMonth(month_number, year, state);

    default:
      return state;
  }
}
