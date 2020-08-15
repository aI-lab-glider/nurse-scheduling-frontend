import { combineReducers } from "redux";
import { ActionModel } from "./models/action.model";
import { ApplicationStateModel } from "./models/application-state.model";
import { scheduleDataReducer } from "./reducers/schedule-data.reducer";

export const appReducer = combineReducers({
  scheduleData: scheduleDataReducer,
} as { [key in keyof ApplicationStateModel]: <T, U>(state: T, action: ActionModel<U>) => T });
