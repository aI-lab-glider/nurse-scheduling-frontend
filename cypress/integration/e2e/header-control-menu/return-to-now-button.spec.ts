/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */

describe("'Come back to now' button", () => {
  context("when schedule is loaded", () => {
    before(() => {
      cy.loadScheduleToMonth();
      cy.get("[data-cy=switch-next-month]").click();
    });

    context("when month is switched to next", () => {
      it("should get you back to current month after clicking 'return to now' button", () => {
        cy.get("[data-cy=return-to-now]").click();
        cy.get("[data-cy=month-name]").contains("Listopad 2020");
      });
    });
  });
});
