/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import * as _ from "lodash";
import { ActionModel } from "../models/action.model";
import { PrimaryMonthRevisionDataModel } from "../models/application-state.model";
import { primaryRevisionInitialState } from "./month-state/schedule-data/schedule-data-initial-state";

export enum PrimaryRevisionAction {
  ADD_MONTH_PRIMARY_REVISION = "ADD_MONTH_BASE_REVISION",
}

export interface AddMonthRevisionAction extends ActionModel<PrimaryMonthRevisionDataModel> {
  type: PrimaryRevisionAction.ADD_MONTH_PRIMARY_REVISION;
}

export function primaryRevisionReducer(
  state: PrimaryMonthRevisionDataModel = primaryRevisionInitialState,
  action: AddMonthRevisionAction
): PrimaryMonthRevisionDataModel {
  switch (action.type) {
    case PrimaryRevisionAction.ADD_MONTH_PRIMARY_REVISION:
      const monthDataModel = action.payload;
      if (!monthDataModel) {
        return state;
      }
      return _.cloneDeep(monthDataModel);
    default:
      return state;
  }
}
