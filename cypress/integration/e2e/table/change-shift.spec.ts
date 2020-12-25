import { WorkerType } from "../../../../src/common-models/worker-info.model";
import { ShiftCode } from "../../../../src/common-models/shift-info.model";

const testData = {
  testedCell: {
    workerType: WorkerType.NURSE,
    workerIdx: 0,
    shiftIdx: 0,
  },
  newShiftCode: ShiftCode.P,
};

context("Change shift", () => {
  before(() => {
    cy.loadSchedule();
  });

  it("Should be able to change shift using dropdown", () => {
    cy.changeWorkerShift({ ...testData.testedCell, newShiftCode: testData.newShiftCode });
    cy.checkWorkerShift({ ...testData.testedCell, desiredShiftCode: testData.newShiftCode });
  });
});
