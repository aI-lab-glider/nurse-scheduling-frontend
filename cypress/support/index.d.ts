declare namespace Cypress {
  interface Chainable {
    loadSchedule(): Chainable<Element>;

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
  }
}
