/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import { MonthInfoModel } from "../../../common-models/month-info.model";
import { copyMonthInfo, createActionName } from "./schedule-data/common-reducers";
import { scheduleDataInitialState } from "./schedule-data/schedule-data-initial-state";
import { ScheduleActionModel } from "./schedule-data/schedule-data.action-creator";
import { ScheduleActionType } from "./schedule-data/temporary-schedule.reducer";

export function monthInfoReducerF(name: string) {
  return (
    state: MonthInfoModel = scheduleDataInitialState.month_info,
    action: ScheduleActionModel
  ): MonthInfoModel => {
    const data = action.payload?.month_info;

    switch (action.type) {
      case createActionName(name, ScheduleActionType.ADD_NEW):
      case createActionName(name, ScheduleActionType.UPDATE):
        if (!data) {
          return state;
        }
        return { ...data };

      case createActionName(name, ScheduleActionType.COPY_FROM_MONTH):
        // eslint-disable-next-line @typescript-eslint/camelcase
        const { month_number, year } = (action.payload as unknown) as {
          month_number: number;
          year: number;
        };
        return copyMonthInfo(month_number, year, state);
      default:
        return state;
    }
  };
}
