/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import { ScheduleDataModel } from "../schedule-data.model";
import { scheduleDataInitialState } from "../schedule-data-initial-state";
import { addNewSchedule, updateSchedule } from "../schedule.actions";
import { createReducer } from "@reduxjs/toolkit";

let uuid = 0;
export const scheduleInfoReducerF = (name: string) =>
  createReducer(scheduleDataInitialState.schedule_info, (builder) => {
    builder
      .addCase(addNewSchedule(name), (state, action) => {
        const { schedule_info: scheduleInfo } = action.payload as ScheduleDataModel;
        uuid += 1;
        if (!scheduleInfo) return state;
        return { ...scheduleInfo, UUID: uuid.toString() };
      })
      .addCase(updateSchedule(name), (state, action) => {
        const { schedule_info } = action.payload as ScheduleDataModel;
        if (!schedule_info) return state;
        return { ...state, ...schedule_info };
      })
      .addDefaultCase((state) => state);
  });
