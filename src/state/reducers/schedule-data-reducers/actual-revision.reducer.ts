import { ScheduleDataModel } from "../../../common-models/schedule-data.model";
import { scheduleDataInitialState } from "./schedule-data-initial-state";
import { ScheduleActionModel } from "./schedule-data.reducer";

export enum ActualRevisionActionaType {
  SET_REVISION = "setRevision",
}

export const actualRevisionMeta = "ACTUAL_REVISION";
export function actualRevisionReducer(
  state: ScheduleDataModel = scheduleDataInitialState,
  action: ScheduleActionModel
): ScheduleDataModel {
  const data = action.payload;
  if (!data) return state;
  switch (action.type) {
    case ActualRevisionActionaType.SET_REVISION:
      return { ...data };
    default:
      return state;
  }
}
