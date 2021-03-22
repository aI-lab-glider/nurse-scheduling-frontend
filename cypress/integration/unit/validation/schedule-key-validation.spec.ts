/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import * as _ from "lodash";
import { ScheduleKey } from "../../../../src/api/persistance-store.model";

describe("Schedule key validation", () => {
  const validYear = 2020;

  it("Should throw when trying to create ScheduleKey with invalid month", (): void => {
    const invalidMonth = validYear;
    const action = (): void => {
      new ScheduleKey(invalidMonth, validYear);
    };
    expect(action).to.throw();
  });

  const validMonths = _.range(0, 12);
  validMonths.forEach((month) => {
    it(`Should not throw when trying to create ScheduleKey with ${month} and year`, (): void => {
      const action = (): void => {
        new ScheduleKey(month, validYear);
      };
      expect(action).to.not.throw();
    });
  });
});
