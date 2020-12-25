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
    cy.get("[data-cy=edit-mode-button]").click();
  });

  it("Should show errors returned by server", () => {
    cy.get("[data-cy=check-schedule-button]").click();
    cy.contains("Za mało pracowników w trakcie dnia w dniu 1, potrzeba 8, jest 5");
    cy.contains("Za mało pracowników w trakcie dnia w dniu 2, potrzeba 8, jest 0");
    cy.contains("Za mało pracowników w nocy w dniu 2, potrzeba 5, jest 0");
  });
});
