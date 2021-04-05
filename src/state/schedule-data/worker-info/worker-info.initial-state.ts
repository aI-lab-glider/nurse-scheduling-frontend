/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import { WorkersInfoModel } from "./worker-info.model";

/* eslint-disable @typescript-eslint/camelcase */
// TODO: Split to separate states for each schedule props
export const workerInfoinitialState: WorkersInfoModel = {
  time: {},
  type: {},
  contractType: {},
  workerGroup: {},
};
