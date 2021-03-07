/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */

import { WorkerType } from "../../../../src/common-models/worker-info.model";

const addWorker = (workerName: string, position: WorkerType) => {
  cy.get('[data-cy="btn-management-tab"]').click();
  cy.get('[data-cy="management-page-title"]').should("be.visible");
  cy.get('[data-cy="btn-add-worker"]').click();
  cy.get('[data-cy="worker-drawer"]').should("be.visible");
  cy.get('[data-cy="name"]').type(workerName);
  cy.get('[data-cy="position"]').click().get(`[data-cy=${position.toLowerCase()}]`).click();
  cy.get('[data-cy="contract"]').click().get('[data-cy="employment_contract"]').click();
  cy.get('[data-cy="contract-time-dropdown"]').click().get('[data-cy="full"]').click();
  cy.get('[data-cy="btn-save-worker"]').click();
  return cy.get('[data-cy="btn-add-worker"]').should("be.visible");
};

context("Schedule errors", () => {
  before(() => {
    cy.loadScheduleToMonth();
  });

  describe("Error test", () => {
    it("Should throw error after adding error user", () => {
      addWorker(Cypress.env("REACT_APP_ERROR_WORKER"), WorkerType.NURSE);
      cy.get('[data-cy="btn-schedule-tab"]').click();
      Cypress.on("uncaught:exception", () => {
        return false;
      });
    });
  });
});
