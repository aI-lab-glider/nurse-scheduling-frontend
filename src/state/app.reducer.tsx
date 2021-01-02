import { combineReducers } from "redux";
import { ActionModel } from "./models/action.model";
import { ApplicationStateModel } from "./models/application-state.model";
import {
  editableScheduleMeta,
  scheduleDataReducer,
} from "./reducers/schedule-data-reducers/schedule-data.reducer";
import { scheduleErrorsReducer } from "./reducers/schedule-errors.reducer";
import undoable from "redux-undo";
import {
  actualRevisionReducer,
  actualRevisionMeta,
} from "./reducers/schedule-data-reducers/actual-revision.reducer";

export const appReducer = combineReducers({
  actualRevision: undoable(actualRevisionReducer, {
    limit: 5,
    filter: (action: ActionModel<unknown>) => action.meta === actualRevisionMeta,
  }),
  scheduleData: undoable(scheduleDataReducer, {
    limit: 50,
    filter: (action: ActionModel<unknown>) => action.meta === editableScheduleMeta,
  }),
  scheduleErrors: scheduleErrorsReducer,
} as { [key in keyof ApplicationStateModel]: <T, U>(state: T, action: ActionModel<U>) => T });
