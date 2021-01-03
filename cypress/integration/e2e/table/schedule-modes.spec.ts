import { ShiftCode } from "../../../../src/common-models/shift-info.model";
import { WorkerType } from "../../../../src/common-models/worker-info.model";

const testedCell = {
  workerType: WorkerType.NURSE,
  workerIdx: 0,
  shiftIdx: 6,
  initialShiftCode: ShiftCode.U,
  desiredShiftCode: ShiftCode.W,
};

context("Schedule modes spec", () => {
  beforeEach(() => {
    cy.loadSchedule();
  });

  it("Should not be able to change shift in readonly mode", () => {
    cy.getWorkerShift(testedCell);
    cy.get(`[data-cy=autocomplete-${testedCell.initialShiftCode}]`, { timeout: 100000 }).should(
      "not.exist"
    );
  });

  it("Should be able to change shift in edit mode", () => {
    cy.enterEditMode();
    cy.checkWorkerShift({ ...testedCell, desiredShiftCode: testedCell.initialShiftCode });
    cy.changeWorkerShift({ ...testedCell, newShiftCode: testedCell.desiredShiftCode });
    cy.checkWorkerShift({ ...testedCell });
  });
});
