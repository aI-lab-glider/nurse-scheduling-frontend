/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */

describe("'Come back to now' button", () => {
  context("when schedule is loaded", () => {
    before(() => {
      cy.loadScheduleToMonth();
    });

    context("month is switched to next", () => {
      cy.get("[data-cy=switch-next-month]").click();
      it("should display 'return to now' button", () => {
        cy.get("[data-cy=return-to-now]").click();
      });
    });
  });
});
