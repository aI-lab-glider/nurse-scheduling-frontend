import { combineReducers } from "redux";
import { ActionModel } from "./models/action.model";
import { ApplicationStateModel } from "./models/application-state.model";
import {
  SCHEDULE_UNDOABLE_CONFIG,
  scheduleDataReducer,
} from "./reducers/schedule-data-reducers/schedule-data.reducer";
import { scheduleErrorsReducer } from "./reducers/schedule-errors.reducer";
import undoable from "redux-undo";
import {
  ACTUAL_REVISION_UNDOABLE_CONFIG,
  actualRevisionReducer,
} from "./reducers/schedule-data-reducers/actual-revision.reducer";

export const appReducer = combineReducers({
  actualRevision: undoable(actualRevisionReducer, {
    limit: 50,
    ...ACTUAL_REVISION_UNDOABLE_CONFIG,
  }),
  scheduleData: undoable(scheduleDataReducer, {
    limit: 50,
    ...SCHEDULE_UNDOABLE_CONFIG,
  }),
  scheduleErrors: scheduleErrorsReducer,
} as { [key in keyof ApplicationStateModel]: <T, U>(state: T, action: ActionModel<U>) => T });
