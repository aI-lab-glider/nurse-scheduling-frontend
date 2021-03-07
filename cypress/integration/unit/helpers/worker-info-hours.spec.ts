/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import { ShiftCode, SHIFTS } from "../../../../src/common-models/shift-info.model";
import { MonthDataArray, ShiftHelper } from "../../../../src/helpers/shifts.helper";
import { WorkerHourInfo } from "../../../../src/helpers/worker-hours-info.model";
import { workerTestData, WorkerTestDataInstance } from "../../../fixtures/march-2021-worker-data";

describe("Worker hours info", () => {
  const calculateWorkerHoursFromWorkerInstance = (
    workerInstance: WorkerTestDataInstance,
    baseWorkerShifts?: ShiftCode[],
    actualWorkerShifts?: ShiftCode[]
  ): WorkerHourInfo =>
    WorkerHourInfo.fromWorkerInfo(
      actualWorkerShifts ?? workerInstance.actualWorkerShifts,
      baseWorkerShifts as MonthDataArray<ShiftCode>,
      workerInstance.workerNorm,
      workerInstance.month,
      workerInstance.year,
      workerInstance.dates
    );

  workerTestData.forEach((workerInstance) => {
    it(`Should calculate same worker norm as norm in example schedule when no base schedule exists for worker ${workerInstance.workerName}`, () => {
      const workerHours = calculateWorkerHoursFromWorkerInstance(workerInstance);
      expect(workerHours.workerHourNorm).to.equal(workerInstance.workerReqiuredHours);
      expect(workerHours.workerTime).to.equal(workerInstance.workerActualHours);
    });
  });

  const exampleWorker = workerTestData[0];

  const workingShifts = Object.values(SHIFTS).filter((shift) => shift.isWorkingShift);
  const freeShifts = Object.values(SHIFTS).filter(
    (shift) => !shift.isWorkingShift && shift.code !== "W"
  );

  freeShifts.forEach((freeShift) => {
    workingShifts.forEach((workingShift) => {
      it(`Should subtract from worker reuired hours duration of ${workingShift.code} when it 
                is replaced with ${freeShift.code}`, () => {
        // Arrange
        const testedShiftIndex = 0;
        const baseWorkerShifts = [...exampleWorker.baseWorkerShifts];
        baseWorkerShifts[testedShiftIndex] = workingShift.code as ShiftCode;
        const actualWorkerShifts = [...baseWorkerShifts];
        const workerHoursInfo = calculateWorkerHoursFromWorkerInstance(
          exampleWorker,
          baseWorkerShifts,
          actualWorkerShifts
        );
        const testedShiftDuration = ShiftHelper.shiftCodeToWorkTime(workingShift);
        const expectedWorkHourNorm = workerHoursInfo.workerHourNorm - testedShiftDuration;
        // Act
        actualWorkerShifts[testedShiftIndex] = freeShift.code as ShiftCode;
        const actualWorkerHoursInfo = calculateWorkerHoursFromWorkerInstance(
          exampleWorker,
          baseWorkerShifts,
          actualWorkerShifts
        );
        // Assert
        expect(actualWorkerHoursInfo.workerHourNorm).to.equal(expectedWorkHourNorm);
      });
    });
  });

  it("Worker norm should not be recalculated if working shift was replaced with W", () => {
    // Arrange
    const testedShiftIndex = 0;
    const baseWorkerShifts = [...exampleWorker.baseWorkerShifts];
    const workingShift = SHIFTS[ShiftCode.D];
    baseWorkerShifts[testedShiftIndex] = workingShift.code as ShiftCode;
    const actualWorkerShifts = [...baseWorkerShifts];
    const workerHoursInfo = calculateWorkerHoursFromWorkerInstance(
      exampleWorker,
      baseWorkerShifts,
      actualWorkerShifts
    );
    const expectedWorkHourNorm = workerHoursInfo.workerHourNorm;
    // Act
    actualWorkerShifts[testedShiftIndex] = ShiftCode.W as ShiftCode;
    const actualWorkerHoursInfo = calculateWorkerHoursFromWorkerInstance(
      exampleWorker,
      baseWorkerShifts,
      actualWorkerShifts
    );
    // Assert
    expect(actualWorkerHoursInfo.workerHourNorm).to.equal(expectedWorkHourNorm);
  });
});
