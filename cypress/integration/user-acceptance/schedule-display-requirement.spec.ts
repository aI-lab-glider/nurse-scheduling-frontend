/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import { ShiftCode } from "../../../src/common-models/shift-info.model";
import { shiftSectionDataCy } from "../../../src/components/schedule-page/table/schedule/sections/worker-info-section/worker-info-section.models";

context("Display schedule", () => {
  it("Should be able to load and display schedule", () => {
    cy.loadScheduleToMonth("example_2.xlsx");
    cy.get(`[data-cy=${shiftSectionDataCy(0)}]`, { timeout: 10000 }).should("exist");
  });

  it("Should be able to read month and year", () => {
    cy.get("#month-switch > span", { timeout: 100 });
    cy.contains("Listopad 2020");
  });

  it("Should be able to read holidays", () => {
    cy.get("#timetableRow > #weekendHeader").should("have.length", 10);
  });

  // TODO: make more generic test
  // it("Should be able to read name and surname of worker", () => {
  //   cy.get(".nametable").children().eq(0).children().eq(0).contains("pielęgniarka 1");

  //   cy.get(".nametable").children().eq(0).children().eq(4).contains("pielęgniarka 5");

  //   cy.get(".nametable").children().eq(1).children().eq(1).contains("opiekunka 10");

  //   cy.get(".nametable").children().eq(1).children().eq(8).contains("opiekunka 8");
  // });

  const shiftCodes = [
    "W",
    "W",
    "W",
    "W",
    "W",
    "W",
    "W",
    "D",
    "R",
    "N",
    "W",
    "D",
    "W",
    "N",
    "W",
    "N",
    "W",
    "W",
    "W",
    "DN",
    "W",
    "N",
    "N",
    "N",
    "N",
    "W",
    "W",
    "D",
    "N",
    "N",
    "W",
    "W",
    "DN",
    "PN",
    "W",
    "DN",
    "W",
    "W",
    "W",
    "W",
    "W",
    "W",
  ];

  const WORKER = {
    teamIdx: 0,
    workerIdx: 1,
  };

  shiftCodes.forEach((k, index) => {
    it("Should be able to read shifts for workers", () => {
      cy.checkWorkerShift({ desiredShiftCode: k as ShiftCode, shiftIdx: index, ...WORKER });
    });
  });
});
