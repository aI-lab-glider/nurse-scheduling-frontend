/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */

import * as _ from "lodash";
import { createReducer } from "@reduxjs/toolkit";
import {
  FoundationInfoAction,
  updateChildrenAndExtraworkers,
} from "./foundation-info.action-creator";
import { scheduleDataInitialState } from "../schedule-data-initial-state";
import { addNewSchedule, isScheduleAction, updateSchedule } from "../schedule.actions";
import { ScheduleActionDestination } from "../../app.reducer";

export const foundationInfoReducerF = (name: ScheduleActionDestination) =>
  createReducer(scheduleDataInitialState.month_info, (builder) => {
    builder
      .addCase(updateChildrenAndExtraworkers(name), (state, action) => {
        const data = (action as FoundationInfoAction).payload;
        if (_.isNil(data)) {
          return state;
        }
        const { extraWorkers, childrenNumber } = data;

        return {
          ...state,
          extra_workers: [...extraWorkers],
          children_number: [...childrenNumber],
        };
      })
      .addCase(updateSchedule(name), (state, action) => {
        if (!isScheduleAction(action)) {
          return state;
        }
        const monthInfo = action.payload?.month_info;
        if (!monthInfo) {
          return state;
        }
        return { ...monthInfo };
      })
      .addCase(addNewSchedule(name), (state, action) => {
        if (!isScheduleAction(action)) {
          return state;
        }
        const monthInfo = action.payload?.month_info;
        if (!monthInfo) {
          return state;
        }
        return { ...monthInfo };
      })
      .addDefaultCase((state) => state);
  });
