/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import { HoursInfoCells } from "../../../support/commands";
describe("Tab management", () => {
  beforeEach(() => {
    cy.loadScheduleToMonth();
    cy.get('[data-cy="btn-management-tab"]').click();
    cy.get('[data-cy="management-page-title"]').should("be.visible");
  });

  describe("Worker drawer management", () => {
    beforeEach(() => {
      cy.get('[data-cy="btn-add-worker"]').click();
      cy.get('[data-cy="worker-drawer"]').should("be.visible");
    });

    describe("Creating worker", () => {
      context("when creating valid worker", () => {
        const newWorker = "Ala makota";

        it("creates the worker", () => {
          cy.get('[data-cy="name"]').type(newWorker);
          cy.get(`[value="${newWorker}"]`).should("be.visible");
          cy.get('[data-cy="position"]').click().get('[data-cy="other"]').click();
          cy.get('[data-cy="contract"]').click().get('[data-cy="employment_contract"]').click();
          cy.get('[data-cy="contract-time-dropdown"]').click().get('[data-cy="other"]').click();
          cy.get('[data-cy="input-employ-time-other"]').click().type("{backspace}{backspace}13");
          cy.get('[data-cy="btn-save-worker"]').click();
          cy.get('[data-cy="btn-add-worker"]').should("be.visible");
          cy.contains(newWorker);
          cy.get('[data-cy="btn-schedule-tab"]').click();
          cy.contains(newWorker);
        });
      });
    });

    describe("Editing the time", () => {
      beforeEach(() => {
        cy.get('[data-cy="contract"]').click();
      });

      it("properly handles employment contract", () => {
        cy.get('[data-cy="employment_contract"]').click();
        cy.get('[data-cy="contract-time-dropdown"]').click().get('[data-cy="full"]').click();
        cy.get('[data-cy="contract-time-dropdown"]').click().get('[data-cy="half"]').click();
        cy.get('[data-cy="contract-time-dropdown"]').click().get('[data-cy="other"]').click();
        cy.get('[data-cy="input-employ-time-other"] input')
          .click()
          .clear({ force: true })
          .type("123");
      });
      it("properly handles civil contract", () => {
        cy.get('[data-cy="civil_contract"]').click();
        cy.get('[data-cy="input-civil-time"]').click();
        cy.get('[data-cy="input-civil-time"] input').clear({ force: true }).type("123");
      });
    });
  });

  describe("Handle worker data edition", () => {
    const testWorker = "Pielęgniarka 2";
    const testWorkerData = {
      teamIdx: 0,
      workerIdx: 1,
      hoursInfo: {
        [HoursInfoCells.required]: 160,
        [HoursInfoCells.actual]: 240,
        [HoursInfoCells.overtime]: 160,
      },
    };

    describe("Editing workers time ", () => {
      beforeEach(() => {
        cy.get('[data-cy="btn-management-tab"]').click();
        cy.get(`[data-cy="edit-worker-${testWorker}"]`).click();
      });
      context("properly handles worker hours edition from 1 to 1/2", () => {
        testWorkerData.hoursInfo = {
          [HoursInfoCells.required]: 80,
          [HoursInfoCells.actual]: 240,
          [HoursInfoCells.overtime]: 160,
        };
        it("properly handles worker hours edition", () => {
          cy.get('[data-cy="contract-time-dropdown"]').click().get('[data-cy="half"]').click();
          cy.get(`[data-cy="btn-save-worker"]`).click();
          cy.get(`[data-cy="worker-hours-${testWorker}"]`).contains("umowa o pracę 1/2");
          cy.get('[data-cy="btn-schedule-tab"]').click();
          cy.checkHoursInfo(testWorkerData);
        });
      });

      context("properly handles worker hours edition from 1/2 to 1", () => {
        testWorkerData.hoursInfo = {
          [HoursInfoCells.required]: 160,
          [HoursInfoCells.actual]: 240,
          [HoursInfoCells.overtime]: 80,
        };
        it("properly handles worker hours edition", () => {
          cy.get('[data-cy="contract-time-dropdown"]').click().get('[data-cy="full"]').click();
          cy.get(`[data-cy="btn-save-worker"]`).click();
          cy.get(`[data-cy="worker-hours-${testWorker}"]`).contains("umowa o pracę 1");
          cy.get('[data-cy="btn-schedule-tab"]').click();
          cy.checkHoursInfo(testWorkerData);
        });
      });
      context("properly handles worker hours edition from 1 to 1/8", () => {
        testWorkerData.hoursInfo = {
          [HoursInfoCells.required]: 20,
          [HoursInfoCells.actual]: 240,
          [HoursInfoCells.overtime]: 220,
        };
        it("properly handles worker hours edition", () => {
          cy.get('[data-cy="contract-time-dropdown"]').click().get('[data-cy="other"]').click();
          cy.get('[data-cy="input-employ-time-other"] input')
            .click()
            .clear({ force: true })
            .type("18");
          cy.get(`[data-cy="btn-save-worker"]`).click();
          cy.get(`[data-cy="worker-hours-${testWorker}"]`).contains("umowa o pracę 1/8");
          cy.get('[data-cy="btn-schedule-tab"]').click();
          cy.checkHoursInfo(testWorkerData);
        });
      });
    });
  });
});
