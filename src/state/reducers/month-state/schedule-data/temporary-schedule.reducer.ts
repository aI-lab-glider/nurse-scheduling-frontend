import { ScheduleDataModel } from "../../../../common-models/schedule-data.model";
import { UndoableConfig } from "../../undoable.action-creator";

export enum ScheduleActionType {
  UPDATE = "UPDATE_SCHEDULE",
  ADD_NEW = "ADD_NEW_SCHEDULE",
  COPY_FROM_MONTH = "COPY_FROM_MONTH",
}

export const TEMPORARY_SCHEDULE_UNDOABLE_CONFIG: UndoableConfig<ScheduleDataModel> = {
  undoType: "TEMPORARY_REVISION_UNDO",
  redoType: "TEMPORARY_REVISION_REDO",
};
/* eslint-disable @typescript-eslint/camelcase */
