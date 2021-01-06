/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import { ScheduleDataModel } from "../../common-models/schedule-data.model";
import { ScheduleMetadata } from "../../common-models/schedule.model";
import { ActionModel } from "../models/action.model";
import {
  HistoryStateModel,
  MonthHistoryRecord,
  MonthStateModel,
} from "../models/application-state.model";
/* eslint-disable @typescript-eslint/camelcase */
enum HistoryReducerAction {
  ADD_MONTH_STATE = "ADD_MONTH_STATE",
}

export class HistoryReducerActionCreator {
  static addToHistory(scheduleModel: MonthStateModel): ActionModel<MonthStateModel> {
    // const payload = cropToOneMonth(scheduleModel);
    return {
      type: HistoryReducerAction.ADD_MONTH_STATE,
      payload: scheduleModel,
    };
  }
}

const createMonthKey = (month: number, year: number): string => `${month}_${year}`;

function isValidMonthModel(
  scheduleModel: ScheduleMetadata
): scheduleModel is Required<ScheduleMetadata> {
  const { month_number, year } = scheduleModel;
  return month_number !== undefined && year !== undefined;
}

function createMonthKeyFromState(monthModel: ScheduleDataModel): string {
  if (!isValidMonthModel(monthModel.schedule_info)) {
    return "";
  }
  const { month_number, year } = monthModel.schedule_info;
  return createMonthKey(month_number, year);
}

export function historyReducer(
  state: HistoryStateModel = {},
  action: ActionModel<MonthHistoryRecord>
): HistoryStateModel {
  if (!action.payload) {
    return state;
  }
  switch (action.type) {
    case HistoryReducerAction.ADD_MONTH_STATE:
      const key = createMonthKeyFromState(action.payload.schedule);
      return { ...state, [key]: action.payload };
    default:
      return state;
  }
}
