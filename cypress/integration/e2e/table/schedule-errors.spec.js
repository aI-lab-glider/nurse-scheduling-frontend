/// <reference types="cypress" />

context("Schedule errors", () => {
  beforeEach(() => {
    cy.server();
    cy.fixture("scheduleErrors.json").then((json) => {
      cy.route({
        method: "POST",
        url: "**/schedule_errors",
        response: json,
      });
    });
    cy.visit(Cypress.env("baseUrl"));
    cy.contains("Plik").click();
    cy.get('[data-cy="file-input"]').attachFile("example.xlsx");
    cy.contains("Edytuj").click();
  });

  it("Should show errors returned by server", () => {
    cy.contains("Sprawdź Plan").click();
    cy.contains("Za mało pracowników w trakcie dnia w dniu 1, potrzeba 8, jest 5");
    cy.contains("Za mało pracowników w trakcie dnia w dniu 2, potrzeba 8, jest 0");
    cy.contains("Za mało pracowników w nocy w dniu 2, potrzeba 5, jest 0");
  });
});
