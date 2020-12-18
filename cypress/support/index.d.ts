declare namespace Cypress {
  interface Chainable {
    loadSchedule(): Chainable<Element>;
  }
}
