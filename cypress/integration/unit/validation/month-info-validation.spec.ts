/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import * as _ from "lodash";
import { MonthInfoModel, validateMonthInfo } from "../../../../src/common-models/month-info.model";
import {
  ScheduleContainerType,
  SCHEDULE_CONTAINERS_LENGTH,
} from "../../../../src/common-models/schedule-data.model";

describe("Month info validation", () => {
  it("Should throw when length of dates in month info model is not allowed length for schedule data model", () => {
    const invalidScheduleLenghth = SCHEDULE_CONTAINERS_LENGTH.SCHEDULE_DM[0] + 1;
    const invalidScheduleModel = createMonthInfoModel(invalidScheduleLenghth);
    const action = (): void =>
      validateMonthInfo(invalidScheduleModel, ScheduleContainerType.SCHEDULE_DM);
    expect(action).to.throw();
  });

  it("Should throw when length of dates in month info model is not allowed length for month data model ", () => {
    const invalidMOnthDayCount = 32;
    const invalidMonthModel = createMonthInfoModel(invalidMOnthDayCount);
    const action = (): void => validateMonthInfo(invalidMonthModel, ScheduleContainerType.MONTH_DM);
    expect(action).to.throw();
  });

  it("Should not throw when dates have valid length and defined", () => {
    const validMonthDayCount = SCHEDULE_CONTAINERS_LENGTH.SCHEDULE_DM[0];
    const validMonthModel = createMonthInfoModel(validMonthDayCount);
    const action = (): void =>
      validateMonthInfo(validMonthModel, ScheduleContainerType.SCHEDULE_DM);
    expect(action).to.not.throw();
  });

  it("Should throw when length of children info is different than length of dates in schedule data model", () => {
    const validLength = SCHEDULE_CONTAINERS_LENGTH.SCHEDULE_DM[0];
    const invalidChildrenCount = validLength - 1;
    const invalidMonthInfoModel = createMonthInfoModel(validLength, invalidChildrenCount);
    const action = (): void =>
      validateMonthInfo(invalidMonthInfoModel, ScheduleContainerType.SCHEDULE_DM);
    expect(action).to.throw();
  });

  it("Should throw when length of extra worker info is different than length of dates in schedule data model", () => {
    const validLength = SCHEDULE_CONTAINERS_LENGTH.SCHEDULE_DM[0];
    const invalidExtraWorkersCount = validLength - 1;
    const invalidMonthInfoModel = createMonthInfoModel(
      validLength,
      validLength,
      invalidExtraWorkersCount
    );
    const action = (): void =>
      validateMonthInfo(invalidMonthInfoModel, ScheduleContainerType.SCHEDULE_DM);
    expect(action).to.throw();
  });

  it("Should not throw when month info is valid", () => {
    const validLength = SCHEDULE_CONTAINERS_LENGTH.SCHEDULE_DM[0];
    const invalidMonthInfoModel = createMonthInfoModel(validLength, validLength, validLength);
    const action = (): void =>
      validateMonthInfo(invalidMonthInfoModel, ScheduleContainerType.SCHEDULE_DM);
    expect(action).to.throw();
  });
});

//#region Helper functions
/* eslint-disable @typescript-eslint/camelcase */
const createMonthInfoModel = (
  dayCount: number,
  childrenCount?: number,
  extraWorkersCount?: number
): MonthInfoModel => ({
  dates: _.range(1, dayCount + 1),
  children_number: !_.isNil(childrenCount) ? _.range(1, childrenCount + 1) : undefined,
  extra_workers: !_.isNil(extraWorkersCount) ? _.range(1, extraWorkersCount) : undefined,
});
//#endregion
