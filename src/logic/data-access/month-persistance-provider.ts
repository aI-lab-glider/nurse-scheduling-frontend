/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import { MonthDataModel } from "../../state/schedule-data/schedule-data.model";
import { RevisionKey } from "./persistance-store.model";

export const DATABASE_NAME = "nurse-scheduling";
export type MonthDMToRevisionKeyDict = { [revisionKey: string]: MonthDataModel };

export abstract class MonthPersistProvider {
  abstract saveMonth(revisionKey: RevisionKey, monthDataModel: MonthDataModel): Promise<void>;

  abstract getMonth(revisionKey: RevisionKey): Promise<MonthDataModel | undefined>;

  abstract reloadDb(): Promise<void>;

  abstract getAllMonths(): Promise<MonthDMToRevisionKeyDict>;
}
