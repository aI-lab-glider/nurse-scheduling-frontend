/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */

context("Menu 'plik'", () => {
  beforeEach(() => {
    cy.visit(Cypress.env("baseUrl"));
  });

  describe("File button", () => {
    it("Should open options menu", () => {
      cy.loadScheduleToMonth();
      cy.contains("Pielęgniarki");
      cy.get("[data-cy=file-dropdown]").click();
      cy.get("[data-cy=load-schedule-button]");
      cy.get("[data-cy=export-schedule-button]");
    });
  });
});
