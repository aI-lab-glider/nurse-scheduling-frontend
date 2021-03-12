/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */

import { baseRowDataCy } from "../schedule-page/table/schedule/schedule-parts/base-row.models";

export const summaryRowDataCy = (cellIndex: number): string => baseRowDataCy(cellIndex);
export interface SummaryTableRowOptions {
  uuid: string;
  rowIndex: number;
  workerName: string;
}
