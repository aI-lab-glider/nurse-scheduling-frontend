/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import { ShiftCode } from "../../../src/state/schedule-data/shifts-types/shift-types.model";
import { shiftSectionDataCy } from "../../../src/components/schedule/worker-info-section/worker-info-section.models";
import {
  shiftCodes,
  WORKER,
} from "../../fixtures/cypress/integration/user-acceptance/schedule-display-requirement";

describe("Display schedule", () => {
  beforeEach(() => {
    cy.loadScheduleToMonth("example_2.xlsx");
  });

  context("when schedule is loaded", () => {
    it("presents required functionalities", () => {
      cy.get(`[data-cy=${shiftSectionDataCy(0)}]`, { timeout: 10000 }).should("exist");
      cy.get("#month-switch > span", { timeout: 100 });
      cy.contains("Listopad 2020");
      cy.get("#timetableRow > #weekendHeader").should("have.length", 10);
      shiftCodes.forEach((k, index) => {
        cy.checkWorkerShift({ desiredShiftCode: k as ShiftCode, shiftIdx: index, ...WORKER });
      });
    });
  });

  // TODO: make more generic test
  // it("Should be able to read name and surname of worker", () => {
  //   cy.get(".nametable").children().eq(0).children().eq(0).contains("pielęgniarka 1");

  //   cy.get(".nametable").children().eq(0).children().eq(4).contains("pielęgniarka 5");

  //   cy.get(".nametable").children().eq(1).children().eq(1).contains("opiekunka 10");

  //   cy.get(".nametable").children().eq(1).children().eq(8).contains("opiekunka 8");
  // });
});
