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
    cy.contains("Za mało pracowników w trakcie dnia w dniu 0, potrzeba 8, jest 5", {
      timeout: 8000,
    });
    cy.contains("Za mało pracowników w trakcie dnia w dniu 1, potrzeba 8, jest 0");
    cy.contains("Za mało pracowników w nocy w dniu 1, potrzeba 5, jest 0");
  });
});
