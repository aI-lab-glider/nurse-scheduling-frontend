/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
const newWorker = "Ala makota";
context("Tab management", () => {
  before(() => {
    cy.loadScheduleToMonth();
    cy.get('[data-cy="btn-management-tab"]').click();
    cy.get('[data-cy="management-page-title"]').should("be.visible");
  });

  describe("Creating worker", () => {
    before(() => {
      cy.get('[data-cy="btn-add-worker"]').click();
      cy.get('[data-cy="worker-drawer"]').should("be.visible");
    });

    it("Should be able to set worker name", () => {
      cy.get('[data-cy="name"]').type(newWorker);
      cy.get(`[value="${newWorker}"]`).should("be.visible");
    });

    it("Should be able to set worker position", () => {
      cy.get('[data-cy="position"]').click().get('[data-cy="other"]').click();
    });

    it("Should be able to set worker norm", () => {
      cy.get('[data-cy="contract"]').click().get('[data-cy="employment_contract"]').click();
      cy.get('[data-cy="contract-time-dropdown"]').click().get('[data-cy="other"]').click();
      cy.get('[data-cy="input-employ-time-other"]').click().type("{backspace}{backspace}13");
    });

    it("Should be able to save worker", () => {
      cy.get('[data-cy="btn-save-worker"]').click();
      cy.get('[data-cy="btn-add-worker"]').should("be.visible");
    });

    it("Should add new worker to worker table", () => {
      cy.contains(newWorker);
    });
    it("Should add new worker to schedule", () => {
      cy.get('[data-cy="btn-schedule-tab"]').click();
      cy.contains(newWorker);
    });
  });

  describe("Editing the time", () => {
    before(() => {
      cy.get('[data-cy="btn-management-tab"]').click();
      cy.get('[data-cy="management-page-title"]').should("be.visible");
      cy.get('[data-cy="btn-add-worker"]').click();
      cy.get('[data-cy="worker-drawer"]').should("be.visible");
    });

    beforeEach(() => {
      cy.get('[data-cy="contract"]').click();
    });

    it("Should properly handle employment contract", () => {
      cy.get('[data-cy="employment_contract"]').click();
      cy.get('[data-cy="contract-time-dropdown"]').click().get('[data-cy="full"]').click();
      cy.get('[data-cy="contract-time-dropdown"]').click().get('[data-cy="half"]').click();
      cy.get('[data-cy="contract-time-dropdown"]').click().get('[data-cy="other"]').click();
      cy.get('[data-cy="input-employ-time-other"] input')
        .click()
        .clear({ force: true })
        .type("123");
    });
    it("Should properly handle civil contract", () => {
      cy.get('[data-cy="civil_contract"]').click();
      cy.get('[data-cy="input-civil-time"]').click();
      cy.get('[data-cy="input-civil-time"] input').clear({ force: true }).type("123");
    });
  });
});
