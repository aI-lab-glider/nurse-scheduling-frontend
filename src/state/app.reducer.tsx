/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */

import { combineReducers } from "redux";
import undoable from "redux-undo";
import { ActionModel } from "./models/action.model";
import { ApplicationStateModel, ScheduleStateModel } from "./models/application-state.model";
import {
  PERSISTENT_SCHEDULE_UNDOABLE_CONFIG,
  TEMPORARY_SCHEDULE_UNDOABLE_CONFIG,
} from "./schedule-state/schedule.actions";
import { scheduleReducerF } from "./schedule-state/schedule.reducer";
import { scheduleErrorsReducer } from "./schedule-state/schedule-errors/schedule-errors.reducer";
import { revisionInfoReducer } from "./schedule-state/schedule-condition/revision-info.reducer";
import { modeInfoReducer } from "./app-condition/mode-info-reducer";
import { primaryRevisionReducer } from "./schedule-state/primary-revision/primary-revision.reducer";

export type CombinedReducers<StateModel> = {
  [key in keyof StateModel]: <T, U>(state: T, action: ActionModel<U>) => T;
};

export const PERSISTENT_SCHEDULE_NAME: ScheduleActionDestination = "PERSISTENT";
export const TEMPORARY_SCHEDULE_NAME: ScheduleActionDestination = "TEMPORARY";

export type ScheduleActionDestination = "PERSISTENT" | "TEMPORARY";

const monthStateReducer = combineReducers({
  revision: revisionInfoReducer,
  mode: modeInfoReducer,
  persistentSchedule: undoable(scheduleReducerF(PERSISTENT_SCHEDULE_NAME), {
    limit: 50,
    ...PERSISTENT_SCHEDULE_UNDOABLE_CONFIG,
  }),
  temporarySchedule: undoable(scheduleReducerF(TEMPORARY_SCHEDULE_NAME), {
    limit: 50,
    ...TEMPORARY_SCHEDULE_UNDOABLE_CONFIG,
  }),
  primaryRevision: primaryRevisionReducer,
  scheduleErrors: scheduleErrorsReducer,
} as CombinedReducers<ScheduleStateModel>);

export const appReducer = combineReducers({
  actualState: monthStateReducer,
} as CombinedReducers<ApplicationStateModel>);
