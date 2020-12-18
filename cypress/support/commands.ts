// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add("login", (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add("drag", { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add("dismiss", { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite("visit", (originalFn, url, options) => { ... })
import "cypress-file-upload";
import { WorkerType } from "../../src/common-models/worker-info.model";

export interface WorkerShiftOptions {
  workerType: WorkerType;
  workerIdx: number;
  shiftIdx: number;
}

Cypress.Commands.add("loadSchedule", () => {
  cy.visit(Cypress.env("baseUrl"));
  cy.contains("Plik").click();
  cy.get('[data-cy="file-input"]').attachFile("example.xlsx");
});

Cypress.Commands.add(
  "getWorkerShift",
  ({ workerType, workerIdx, shiftIdx }: WorkerShiftOptions) => {
    return cy
      .get(`[data-cy="${workerType.toLowerCase()}ShiftsTable"]`)
      .children()
      .children()
      .eq(workerIdx)
      .children()
      .eq(shiftIdx)
      .children()
      .children();
  }
);
