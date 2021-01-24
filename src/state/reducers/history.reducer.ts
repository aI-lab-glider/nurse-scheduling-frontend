/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import { MonthDataModel } from "../../common-models/schedule-data.model";
import { ActionModel } from "../models/action.model";
import { HistoryStateModel } from "../models/application-state.model";

enum HistoryReducerAction {
  ADD_MONTH_STATE = "ADD_MONTH_STATE",
}

export class HistoryReducerActionCreator {
  static addToMonthHistory(monthModel: MonthDataModel): ActionModel<MonthDataModel> {
    return {
      type: HistoryReducerAction.ADD_MONTH_STATE,
      payload: monthModel,
    };
  }
}

export function historyReducer(
  state: HistoryStateModel = {},
  action: ActionModel<MonthDataModel>
): HistoryStateModel {
  if (!action.payload) {
    return state;
  }
  switch (action.type) {
    case HistoryReducerAction.ADD_MONTH_STATE:
      return { ...state, [action.payload.scheduleKey.dbKey]: action.payload };
    default:
      return state;
  }
}
