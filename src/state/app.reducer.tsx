import { combineReducers } from "redux";
import { ActionModel } from "./models/action.model";
import { ApplicationStateModel, MonthStateModel } from "./models/application-state.model";
import { scheduleErrorsReducer } from "./reducers/month-state/schedule-errors.reducer";
import undoable from "redux-undo";
import { historyReducer } from "./reducers/history.reducer";
import {
  PERSISTENT_SCHEDULE_UNDOABLE_CONFIG,
  scheduleReducerF,
} from "./reducers/month-state/schedule-data/persistent-schedule.reducer";
import { TEMPORARY_SCHEDULE_UNDOABLE_CONFIG } from "./reducers/month-state/schedule-data/temporary-schedule.reducer";

export type CombinedReducers<StateModel> = {
  [key in keyof StateModel]: <T, U>(state: T, action: ActionModel<U>) => T;
};

export const PERSISTENT_SCHEDULE_NAME: ScheduleActionDestination = "PERSISTENT";
export const TEMPORARY_SCHEDULE_NAME: ScheduleActionDestination = "TEMPORARY";

export type ScheduleActionDestination = "PERSISTENT" | "TEMPORARY";

const monthStateReducer = combineReducers({
  persistentSchedule: undoable(scheduleReducerF(PERSISTENT_SCHEDULE_NAME), {
    limit: 50,
    ...PERSISTENT_SCHEDULE_UNDOABLE_CONFIG,
  }),
  temporarySchedule: undoable(scheduleReducerF(TEMPORARY_SCHEDULE_NAME), {
    limit: 50,
    ...TEMPORARY_SCHEDULE_UNDOABLE_CONFIG,
  }),
  scheduleErrors: scheduleErrorsReducer,
} as CombinedReducers<MonthStateModel>);

export const appReducer = combineReducers({
  actualState: monthStateReducer,
  history: historyReducer,
} as CombinedReducers<ApplicationStateModel>);
