/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import { addNewSchedule, isScheduleAction, updateSchedule } from "../schedule.actions";
import { scheduleDataInitialState } from "../schedule-data-initial-state";
import { createAction, createReducer } from "@reduxjs/toolkit";

export const setScheduleCorrupted = createAction("schedule/setIsCorrupted");
export const corruptedInfoReducerF = (name: string) =>
  createReducer(scheduleDataInitialState.isCorrupted, (builder) => {
    builder
      .addCase(addNewSchedule(name), (state, action) => {
        if (!isScheduleAction(action)) {
          return state;
        }
        return action.payload?.isCorrupted ?? false;
      })
      .addCase(setScheduleCorrupted, () => true)
      .addCase(updateSchedule(name), (state, action) => {
        if (!isScheduleAction(action)) {
          return state;
        }
        return action.payload?.isCorrupted ?? false;
      })
      .addDefaultCase((state) => state);
  });
