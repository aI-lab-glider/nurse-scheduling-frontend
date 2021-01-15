/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
context("Schedule errors", () => {
  before(() => {
    cy.server();
    cy.fixture("scheduleErrors.json").then((json) => {
      cy.route({
        method: "POST",
        url: "**/schedule_errors",
        response: json,
      });
    });
    cy.loadSchedule();
    cy.enterEditMode();
  });

  it("Should show errors returned by server", () => {
    cy.get("[data-cy=save-schedule-button]").click();
    cy.get("[data-cy=check-schedule-button]").click();
    cy.get("[data-cy=open-folding-section-undertime-errors]").click();
    cy.contains("Za mało pracowników w trakcie dnia w dniu 1, potrzeba 8, jest 5");
    cy.contains("Za mało pracowników w trakcie dnia w dniu 2, potrzeba 8, jest 0");
    cy.contains("Za mało pracowników w nocy w dniu 2, potrzeba 5, jest 0");
  });
});
