/// <reference path="../../../support/index.d.ts" />

context("Undo redo test", () => {
  before(() => {
    cy.loadSchedule();
    cy.contains("Edytuj").click();
  });
  beforeEach(() => {
    cy.get("#cyTestedSection").children().children().children().eq(0).as("cell");
    cy.get("@cell").contains("DN").click();
    cy.contains("popołudnie").click();
  });

  it("Undo button test", () => {
    cy.get("#undo-button").click();
    cy.get("#cyTestedSection").children().children().children().eq(0).contains("DN");
  });

  it("Redo button test", () => {
    cy.get("#undo-button").click();
    cy.get("#cyTestedSection").children().children().children().eq(0).contains("DN");
    cy.get("#redo-button").click();
    cy.get("#cyTestedSection").children().children().children().eq(0).contains("P");
  });
});
