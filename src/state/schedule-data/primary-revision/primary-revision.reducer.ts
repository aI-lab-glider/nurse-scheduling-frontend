/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import { createAction, createReducer } from "@reduxjs/toolkit";
import * as _ from "lodash";
import { ActionModel } from "../../../utils/action.model";
import { PrimaryMonthRevisionDataModel } from "../../application-state.model";
import { primaryRevisionInitialState } from "./primary-revision.initial-state";

export enum PrimaryRevisionAction {
  ADD_MONTH_PRIMARY_REVISION = "ADD_MONTH_BASE_REVISION",
}

export interface AddMonthRevisionAction extends ActionModel<PrimaryMonthRevisionDataModel> {
  type: PrimaryRevisionAction.ADD_MONTH_PRIMARY_REVISION;
}
export const addMonthPrimaryRevision = createAction<PrimaryMonthRevisionDataModel>(
  "schedule/addMonthPrimaryRevision"
);
export const primaryRevisionReducer = createReducer(primaryRevisionInitialState, (builder) => {
  builder
    .addCase(addMonthPrimaryRevision, (state, action) => {
      const monthDataModel = action.payload;
      if (!monthDataModel) {
        return state;
      }
      return _.cloneDeep(monthDataModel);
    })
    .addDefaultCase((state) => state);
});
