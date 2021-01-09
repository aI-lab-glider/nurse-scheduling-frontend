/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
declare namespace Cypress {
  interface Chainable {
    loadSchedule(scheduleName?: import("./commands").ScheduleName): Chainable<Element>;

    useAutocomplete(
      newShiftCode: import("../../src/common-models/shift-info.model").ShiftCode
    ): Chainable<Element>;

    getWorkerShift(
      GetWorkerShiftOptions: import("./commands").GetWorkerShiftOptions
    ): Chainable<Element>;

    checkWorkerShift(
      CheckWorkerShift: import("./commands").CheckWorkerShiftOptions
    ): Chainable<Element>;

    changeWorkerShift(
      ChangeWorkerShiftOptions: import("./commands").ChangeWorkerShiftOptions
    ): Chainable<Element>;

    checkHoursInfo(
      ChangeWorkerShiftOptions: import("./commands").CheckHoursInfoOptions
    ): Chainable<Element>;

    enterEditMode(): Chainable<Element>;
    saveToDatabase(): Chainable<Element>;
    leaveEditMode(): Chainable<Element>;
  }
}
