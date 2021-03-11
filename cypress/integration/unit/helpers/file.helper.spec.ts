/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import { FileHelper } from "../../../../src/helpers/file.helper";
import { ScheduleDataModel } from "../../../../src/common-models/schedule-data.model";
import schedule from "../../../fixtures/schedule";
import { cropScheduleDMToMonthDM } from "../../../../src/logic/schedule-container-convertion/schedule-container-convertion";

describe("FileHelper", () => {
  it(`Should properly create directory name based on filename`, () => {
    const result = FileHelper.createDirNameFromFile("maj_2021_wersja_bazowa.xlsx");
    expect(result).to.eql("maj_2021");
  });

  it(`Should return properly create filename base on month model and revision type`, () => {
    const result = FileHelper.createMonthFilename(
      cropScheduleDMToMonthDM(schedule as ScheduleDataModel),
      "actual"
    );
    expect(result).to.eql("luty_2021_wersja_aktualna.xlsx");
  });
});
