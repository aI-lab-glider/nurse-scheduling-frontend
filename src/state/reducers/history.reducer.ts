/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import { ScheduleModel } from "../../common-models/schedule.model";
import { ActionModel } from "../models/action.model";
import { HistoryStateModel, MonthStateModel } from "../models/application-state.model";
/* eslint-disable @typescript-eslint/camelcase */
enum HistoryReducerAction {
  ADD_MONTH_STATE = "ADD_MONTH_STATE",
}

export class HistoryReducerActionCreator {
  static addToHistory(scheduleModel: MonthStateModel): ActionModel<MonthStateModel> {
    return {
      type: HistoryReducerAction.ADD_MONTH_STATE,
      payload: scheduleModel,
    };
  }
}

export const createMonthKey = (month: number, year: number): string => `${month}_${year}`;

function isValidMonthModel(scheduleModel: ScheduleModel): scheduleModel is Required<ScheduleModel> {
  const { month_number, year } = scheduleModel;
  return month_number !== undefined && year !== undefined;
}

function createMonthKeyFromState(monthModel: MonthStateModel): string {
  if (!isValidMonthModel(monthModel.persistentSchedule.present.schedule_info)) {
    return "";
  }
  const { month_number, year } = monthModel.persistentSchedule.present.schedule_info;
  return createMonthKey(month_number, year);
}

export function historyReducer(
  state: HistoryStateModel = {},
  action: ActionModel<MonthStateModel>
): HistoryStateModel {
  if (!action.payload) {
    return state;
  }
  switch (action.type) {
    case HistoryReducerAction.ADD_MONTH_STATE:
      const key = createMonthKeyFromState(action.payload);
      return { ...state, [key]: action.payload };
    default:
      return state;
  }
}
