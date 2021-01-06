/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import { combineReducers } from "redux";
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
