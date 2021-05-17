/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */

import { ActionModel } from "../../../utils/action.model";
import { createAction } from "@reduxjs/toolkit";

export enum FoundationInfoActionType {
  UPDATE_CHILDREN_AND_EXTRAWORKERS = "UPDATE_CHILDREN_AND_EXTRAWORKERS",
}

export type FoundationInfoAction = ActionModel<UpdateChildrenAndExtraworkersPayload>;

interface UpdateChildrenAndExtraworkersPayload {
  extraWorkers: number[];
  childrenNumber: number[];
}

export const updateChildrenAndExtraworkers = createAction<UpdateChildrenAndExtraworkersPayload>(
  "schedule/updateChildrenAndExtraworkers"
);
