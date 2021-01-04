import { ShiftCode, ShiftInfoModel } from "../../../common-models/shift-info.model";
import { scheduleDataInitialState } from "./schedule-data/schedule-data-initial-state";
import { TemporaryScheduleActionType } from "./schedule-data/temporary-schedule.reducer";
import { ScheduleActionModel } from "./schedule-data/schedule-data.action-creator";
import { PersistentScheduleActionType } from "./schedule-data/persistent-schedule.reducer";
import { daysInMonth } from "./schedule-data/month-preparation";
import { ArrayHelper } from "../../../helpers/array.helper";
import * as _ from "lodash";
export function shiftsInfoReducer(
  state: ShiftInfoModel = scheduleDataInitialState.shifts,
  action: ScheduleActionModel
): ShiftInfoModel {
  const data = action.payload?.shifts;
  if (!data && action.type != PersistentScheduleActionType.COPY_FROM_MONTH) return state;
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
      const days = daysInMonth(month_number, year).length;
      const copiedState = _.cloneDeep(state);
      Object.keys(copiedState).forEach((key) => {
        const values = copiedState[key].slice(0, days);
        copiedState[key] = values.map((shift) =>
          [ShiftCode.L4, ShiftCode.U, ShiftCode.K].includes(shift) ? ShiftCode.W : shift
        );
      });

      return copiedState;

    default:
      return state;
  }
}
