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
      actualWorkerShifts ?? workerInstance.workerShifts,
      (baseWorkerShifts ?? workerInstance.workerShifts) as MonthDataArray<ShiftCode>,
      workerInstance.workerTime,
      workerInstance.month,
      workerInstance.year
    );

  workerTestData.forEach((workerInstance) => {
    it("Should calculate same worker norm as norm in example schedule when no base schedule exists", () => {
      const workerHours = calculateWorkerHoursFromWorkerInstance(workerInstance);
      expect(workerHours.workerTime).to.equal(workerInstance.workerTime);
    });
  });

  const exampleWorker = workerTestData[0];

  const workingShifts = Object.values(SHIFTS).filter((shift) => shift.isWorkingShift);
  const freeShifts = Object.values(SHIFTS).filter(
    (shift) => !shift.isWorkingShift && shift.code !== "W"
  );

  freeShifts.forEach((freeShift) => {
    workingShifts.forEach((workingShift) => {
      it(`Should subtract from worker norm duration of ${workingShift} when it 
                is replaced with ${freeShift.code}`, () => {
        // Arrange
        exampleWorker.workerShifts[0] = workingShift.code as ShiftCode;
        const baseWorkerShifts = [...exampleWorker.workerShifts];
        const workerHoursInfo = calculateWorkerHoursFromWorkerInstance(
          exampleWorker,
          baseWorkerShifts,
          baseWorkerShifts
        );
        const shiftDuration = ShiftHelper.shiftCodeToWorkTime(workingShift);
        const expectedWorkTime = workerHoursInfo.workerTime - shiftDuration;
        // Act
        exampleWorker.workerShifts[0] = freeShift.code as ShiftCode;
        const actualShifts = [...exampleWorker.workerShifts];
        const actualWorkHourInfo = calculateWorkerHoursFromWorkerInstance(
          exampleWorker,
          baseWorkerShifts,
          actualShifts
        );
        // Assert
        expect(actualWorkHourInfo.workerTime).to.equal(expectedWorkTime);
      });
    });
  });

  it("Worker norm should not be recalculated if working shift was replaced with W", () => {
    // Arrange
    const workingShift = SHIFTS[ShiftCode.D];
    exampleWorker.workerShifts[0] = workingShift.code as ShiftCode;
    const baseWorkerShifts = [...exampleWorker.workerShifts];
    const workerHoursInfo = calculateWorkerHoursFromWorkerInstance(
      exampleWorker,
      baseWorkerShifts,
      baseWorkerShifts
    );
    const expectedWorkTime = workerHoursInfo.workerTime;
    // Act
    exampleWorker.workerShifts[0] = ShiftCode.W;
    const actualShifts = [...exampleWorker.workerShifts];
    const actualWorkHourInfo = calculateWorkerHoursFromWorkerInstance(
      exampleWorker,
      baseWorkerShifts,
      actualShifts
    );
    // Assert
    expect(actualWorkHourInfo.workerTime).to.equal(expectedWorkTime);
  });
});
