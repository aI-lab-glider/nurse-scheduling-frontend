declare namespace Cypress {
  interface Chainable {
    loadSchedule(): Chainable<Element>;
    getWorkerShift(WorkerShiftOptions: import("./commands").WorkerShiftOptions): Chainable<Element>;
  }
}
