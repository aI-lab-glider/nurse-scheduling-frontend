/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
context("Schedule errors", () => {
  before(() => {
    cy.intercept(
      {
        method: "POST",
        url: "**/schedule_errors",
      },
      {
        fixture: "scheduleErrors.json",
      }
    );
    cy.loadScheduleToMonth();
    cy.enterEditMode();
  });

  it("Should show errors returned by server", () => {
    cy.get("[data-cy=save-schedule-button]").click();
    cy.get("[data-cy=check-schedule-button]").click();
    cy.get("[data-cy=open-folding-section]").click({ multiple: true });
    cy.contains("Za mało pracowników w trakcie dnia w dniu 7 w godzinach 6-22, potrzeba 8, jest 3");
    cy.contains("Za mało pracowników w trakcie dnia w dniu 8 w godzinach 6-22, potrzeba 8, jest 4");
    cy.contains("Za mało pracowników w nocy w dniu 9 w godzinach 6-22, potrzeba 5, jest 3");
  });
});
