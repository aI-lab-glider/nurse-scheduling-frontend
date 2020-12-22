import { WorkerType } from "../../../../src/common-models/worker-info.model";
import { ShiftCode } from "../../../../src/common-models/shift-info.model";

const testData = {
  testedShift: {
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
    cy.changeWorkerShift({ ...testData.testedShift, newShiftCode: testData.newShiftCode });

    cy.getWorkerShift(testData.testedShift).contains(testData.newShiftCode);
  });
});
