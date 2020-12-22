import { GetWorkerShiftOptions } from "../../../support/commands";
import { WorkerType } from "../../../../src/common-models/worker-info.model";

const testedShift: GetWorkerShiftOptions = {
  workerType: WorkerType.NURSE,
  workerIdx: 0,
  shiftIdx: 0,
};

context("Change shift", () => {
  beforeEach(() => {
    cy.visit(Cypress.env("baseUrl"));
    cy.contains("Plik").click();
    cy.get('[data-cy="file-input"]').attachFile("example.xlsx");
    cy.getWorkerShift(testedShift).as("cell").contains("DN");
  });

  it("Should be able to change shift using dropdown", () => {
    cy.get("@cell").click();
    cy.contains("Popołudnie").click();

    cy.getWorkerShift(testedShift).contains("P");
  });
});
