import { combineReducers } from "redux";
import { ActionModel } from "./models/action.model";
import { ApplicationStateModel } from "./models/application-state.model";
import { scheduleDataReducer } from "./reducers/schedule-data.reducer";
import { xlxsSheetDataReducer } from "./reducers/xlxs-sheet-data-reducer";

export const appReducer = combineReducers({
  scheduleData: scheduleDataReducer,
  uploadedScheduleSheet: xlxsSheetDataReducer,
} as { [key in keyof ApplicationStateModel]: <T, U>(state: T, action: ActionModel<U>) => T });
