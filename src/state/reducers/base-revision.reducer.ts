/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import * as _ from "lodash";
import { ActionModel } from "../models/action.model";
import { BaseMonthRevisionDataModel } from "../models/application-state.model";
import { baseRevisionInitialState } from "./month-state/schedule-data/schedule-data-initial-state";

export enum BaseRevisionAction {
  ADD_MONTH_BASE_REVISION = "ADD_MONTH_BASE_REVISION",
}

export interface AddMonthRevisionAction extends ActionModel<BaseMonthRevisionDataModel> {
  type: BaseRevisionAction.ADD_MONTH_BASE_REVISION;
}

export function baseRevisionReducer(
  state: BaseMonthRevisionDataModel = baseRevisionInitialState,
  action: AddMonthRevisionAction
): BaseMonthRevisionDataModel {
  switch (action.type) {
    case BaseRevisionAction.ADD_MONTH_BASE_REVISION:
      const monthDataModel = action.payload;
      if (!monthDataModel) {
        return state;
      }
      return _.cloneDeep(monthDataModel);
    default:
      return state;
  }
}
