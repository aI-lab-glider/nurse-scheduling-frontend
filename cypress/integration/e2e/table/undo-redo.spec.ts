/// <reference path="../../../support/index.d.ts" />

import { WorkerType } from "../../../../src/common-models/worker-info.model";
import { WorkerShiftOptions } from "../../../support/commands";

const testedShift: WorkerShiftOptions = {
  workerType: WorkerType.NURSE,
  workerIdx: 0,
  shiftIdx: 0,
};

context("Undo redo test", () => {
  before(() => {
    cy.loadSchedule();
    cy.contains("Edytuj").click();
  });

  beforeEach(() => {
    cy.getWorkerShift(testedShift).click();
    cy.get("[data-cy=autocomplete-R]").click();

    cy.getWorkerShift(testedShift).click();
    cy.get("[data-cy=autocomplete-P]").click();
  });

  it("Undo/Redo button test", () => {
    cy.get("[data-cy=undo-button]").click();
    cy.getWorkerShift(testedShift).contains("R");

    cy.get("[data-cy=redo-button]").click();
    cy.getWorkerShift(testedShift).contains("P");
  });

  it("Undo/Redo shortcuts test", () => {
    cy.get("body").type("{ctrl}{z}");
    cy.getWorkerShift(testedShift).contains("R");

    cy.get("body").type("{ctrl}{shift}{z}");
    cy.get("[data-cy=redo-button]").click();
    cy.getWorkerShift(testedShift).contains("P");
  });
});
