import { combineReducers } from "redux";
import { ActionModel } from "./models/action.model";
import { ApplicationStateModel } from "./models/application-state.model";
import { scheduleDataReducer } from "./reducers/schedule-data.reducer";
import { scheduleErrorsReducer } from "./reducers/schedule-errors.reducer";
import undoable from "redux-undo";

export const appReducer = combineReducers({
  scheduleData: undoable(scheduleDataReducer, { limit: 50 }),
  scheduleErrors: scheduleErrorsReducer,
} as { [key in keyof ApplicationStateModel]: <T, U>(state: T, action: ActionModel<U>) => T });
