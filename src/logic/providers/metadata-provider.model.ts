/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import { VerboseDate } from "../../common-models/month-info.model";
import { MonthInfoLogic } from "../schedule-logic/month-info.logic";

export abstract class MetadataProvider {
  abstract get monthNumber(): number;
  abstract get year(): number;
  abstract get daysFromPreviousMonthExists(): boolean;
  abstract get frozenDates(): [number | string, number][];
  abstract get dates(): number[];
  abstract get monthLogic(): MonthInfoLogic;
  get verboseDates(): VerboseDate[] {
    return [];
  }
  changeShiftFrozenState(rowind: number, shiftIndex: number): [number, number][] {
    return [];
  }
}
