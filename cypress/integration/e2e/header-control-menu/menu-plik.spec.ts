/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */

describe("Menu 'plik'", () => {
  context("when schedule is loaded", () => {
    before(() => {
      cy.loadScheduleToMonth();
    });

    context("when dropdown is pressed", () => {
      it("should open options menu", () => {
        cy.contains("Zespół 1");
        cy.get("[data-cy=file-dropdown]").click();
        cy.get("[data-cy=load-schedule-button]");
        cy.get("[data-cy=export-schedule-button]");
      });
    });
  });
});
