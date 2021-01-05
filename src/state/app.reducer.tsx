import { combineReducers } from "redux";
import { ActionModel } from "./models/action.model";
import { ApplicationStateModel, MonthStateModel } from "./models/application-state.model";
import { scheduleErrorsReducer } from "./reducers/month-state/schedule-errors.reducer";
import undoable from "redux-undo";
import { historyReducer } from "./reducers/history.reducer";
import {
  persistentScheduleReducer,
  PERSISTENT_SCHEDULE_UNDOABLE_CONFIG,
} from "./reducers/month-state/schedule-data/persistent-schedule.reducer";
import {
  temporaryScheduleReducer,
  TEMPORARY_SCHEDULE_UNDOABLE_CONFIG,
} from "./reducers/month-state/schedule-data/temporary-schedule.reducer";

export type CombinedReducers<StateModel> = {
  [key in keyof StateModel]: <T, U>(state: T, action: ActionModel<U>) => T;
};

const monthStateReducer = combineReducers({
  persistentSchedule: undoable(persistentScheduleReducer, {
    limit: 50,
    ...PERSISTENT_SCHEDULE_UNDOABLE_CONFIG,
  }),
  temporarySchedule: undoable(temporaryScheduleReducer, {
    limit: 50,
    ...TEMPORARY_SCHEDULE_UNDOABLE_CONFIG,
  }),
  scheduleErrors: scheduleErrorsReducer,
} as CombinedReducers<MonthStateModel>);

export const appReducer = combineReducers({
  actualState: monthStateReducer,
  history: historyReducer,
} as CombinedReducers<ApplicationStateModel>);
