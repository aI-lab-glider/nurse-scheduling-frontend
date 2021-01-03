import { combineReducers } from "redux";
import { ActionModel } from "./models/action.model";
import { ApplicationStateModel } from "./models/application-state.model";
import {
  TEMPORARY_SCHEDULE_UNDOABLE_CONFIG,
  temporaryScheduleReducer,
} from "./reducers/schedule-data-reducers/temporary-schedule.reducer";
import { scheduleErrorsReducer } from "./reducers/schedule-errors.reducer";
import undoable from "redux-undo";
import {
  PERSISTENT_SCHEDULE_UNDOABLE_CONFIG,
  persistentScheduleReducer,
} from "./reducers/schedule-data-reducers/persistent-schedule.reducer";

export const appReducer = combineReducers({
  persistentSchedule: undoable(persistentScheduleReducer, {
    limit: 50,
    ...PERSISTENT_SCHEDULE_UNDOABLE_CONFIG,
  }),
  temporarySchedule: undoable(temporaryScheduleReducer, {
    limit: 50,
    ...TEMPORARY_SCHEDULE_UNDOABLE_CONFIG,
  }),
  scheduleErrors: scheduleErrorsReducer,
} as { [key in keyof ApplicationStateModel]: <T, U>(state: T, action: ActionModel<U>) => T });
