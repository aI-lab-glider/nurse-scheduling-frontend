/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */

import { combineReducers } from "redux";
import { ScheduleActionDestination } from "../app.reducer";
import { employeeInfoReducerF } from "./worker-info/worker-info.reducer";
import { foundationInfoReducerF } from "./foundation-info/foundation-info.reducer";
import { scheduleInfoReducerF } from "./month-info/month-info.reducer";
import { workerShiftsReducerF } from "./workers-shifts/worker-shifts.reducer";
import { generationInfoReducerF } from "./schedule-condition/generation-info.reducer";
import { corruptedInfoReducerF } from "./schedule-condition/corrupted-info.reducer";
import { shiftsModelReducer } from "./shifts-types/shifts-model.reducer";

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export function scheduleReducerF(name: ScheduleActionDestination) {
  return combineReducers({
    schedule_info: scheduleInfoReducerF(name),
    shifts: workerShiftsReducerF(name),
    month_info: foundationInfoReducerF(name),
    employee_info: employeeInfoReducerF(name),
    isAutoGenerated: generationInfoReducerF(name),
    shift_types: shiftsModelReducer,
    isCorrupted: corruptedInfoReducerF(name),
  });
}
