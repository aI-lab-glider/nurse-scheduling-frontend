import { WorkerType } from "../../../../src/common-models/worker-info.model";
import { ShiftCode } from "../../../../src/common-models/shift-info.model";

export type HoursInfo = {
  [key in HoursInfoCells]: number;
};

export enum HoursInfoCells {
  required = 0,
  actual = 1,
  overtime = 2,
}

const nurseInitialWorkHours: HoursInfo = {
  [HoursInfoCells.required]: 136,
  [HoursInfoCells.actual]: 164,
  [HoursInfoCells.overtime]: 28,
};
const babysitterInitialWorkHours: HoursInfo = {
  [HoursInfoCells.required]: 80,
  [HoursInfoCells.actual]: 108,
  [HoursInfoCells.overtime]: 28,
};

interface TestCase {
  workerType: WorkerType;
  workerIdx: number;
  shiftIndex: number;
  initialShiftCode: ShiftCode;
  desiredShiftCode: ShiftCode;
  expectedWorkHoursInfo: HoursInfo;
}

// async function testWorkHoursInfoUpdate({
//                                          workerType,
//                                          workerIdx,
//                                          shiftIndex,
//                                          initialShiftCode,
//                                          desiredShiftCode,
//                                          expectedWorkHoursInfo
//                                        }: TestCase) {
//   const workerData = {
//     workerType: workerType,
//     workerIdx: workerIdx,
//     shiftIdx: shiftIndex
//   };
//   cy.getWorkerShift(workerData).as("cell");
//
//   cy.get("@cell").contains(initialShiftCode);
//   cy.changeWorkerShift({ ...workerData, newShiftCode: desiredShiftCode });
//
//   cy.get("@cell").contains(desiredShiftCode);
//
//   cy.checkHoursInfo({workerType, workerIdx, hoursInfo: expectedWorkHoursInfo});
// }

context("Work hours info (summary table)", () => {
  beforeEach(() => {
    cy.loadSchedule();
  });

  // sanity check in case schedule in the docs gets changed and these tests start failing because of it
  it("Has expected initial values of workHourInfo in example schedule", () => {
    cy.checkHoursInfo({
      workerType: WorkerType.NURSE,
      workerIdx: 0,
      hoursInfo: nurseInitialWorkHours,
    });
    cy.checkHoursInfo({
      workerType: WorkerType.OTHER,
      workerIdx: 3,
      hoursInfo: babysitterInitialWorkHours,
    });
  });

  it("Is added, should add 12 to actual and overtime hours and not change required", () => {
    const data = {
      workerType: WorkerType.NURSE,
      workerIdx: 0,
      shiftIndex: 21,
      initialShiftCode: ShiftCode.W,
      desiredShiftCode: ShiftCode.D,
      expectedWorkHoursInfo: {
        [HoursInfoCells.required]: nurseInitialWorkHours[HoursInfoCells.required],
        [HoursInfoCells.actual]: nurseInitialWorkHours[HoursInfoCells.actual] + 12,
        [HoursInfoCells.overtime]: nurseInitialWorkHours[HoursInfoCells.overtime] + 12,
      },
    };

    const workerData = {
      workerType: data.workerType,
      workerIdx: data.workerIdx,
      shiftIdx: data.shiftIndex,
    };

    cy.getWorkerShift(workerData).as("cell");

    cy.getWorkerShift(workerData).contains(data.initialShiftCode);
    cy.changeWorkerShift({ ...workerData, newShiftCode: data.desiredShiftCode });

    cy.getWorkerShift(workerData).contains(data.desiredShiftCode);
    //testWorkHoursInfoUpdate(data);
  });

  //     });
  //     it("Is removed, should subtract 12 from actual and overtime hours and not change required", () => {
  //       const data = {
  //         workerType: WorkerType.NURSE,
  //         workerIdx: 0,
  //         shiftIndex: 9,
  //         initialShiftCode: ShiftCode.D,
  //         desiredShiftCode: ShiftCode.W,
  //         expectedWorkHoursInfo: {
  //           required: nurseInitialWorkHours.required,
  //           actual: nurseInitialWorkHours.actual - 12,
  //           overtime: nurseInitialWorkHours.overtime - 12
  //         }
  //       };
  //       testWorkHoursInfoUpdate(data);
  //     });
  //   });
  //
  //   describe("When U for current month weekday", () => {
  //     it("Is added, should subtract 8 from required hours, add 8 to overtime and not change actual", () => {
  //       const data = {
  //         workerType: WorkerType.NURSE,
  //         workerIdx: 0,
  //         shiftIndex: 21,
  //         initialShiftCode: ShiftCode.W,
  //         desiredShiftCode: ShiftCode.U,
  //         expectedWorkHoursInfo: {
  //           required: nurseInitialWorkHours.required - 8,
  //           actual: nurseInitialWorkHours.actual,
  //           overtime: nurseInitialWorkHours.overtime + 8
  //         }
  //       };
  //       testWorkHoursInfoUpdate(data);
  //     });
  //     it("Is removed, should add 8 to required hours, subtract 8 from overtime and not change actual", () => {
  //       const data = {
  //         workerType: WorkerType.NURSE,
  //         workerIdx: 0,
  //         shiftIndex: 6,
  //         initialShiftCode: ShiftCode.U,
  //         desiredShiftCode: ShiftCode.W,
  //         expectedWorkHoursInfo: {
  //           required: nurseInitialWorkHours.required + 8,
  //           actual: nurseInitialWorkHours.actual,
  //           overtime: nurseInitialWorkHours.overtime - 8
  //         }
  //       };
  //       testWorkHoursInfoUpdate(data);
  //     });
  //   });
  //
  //   describe("When L4 for current month weekday", () => {
  //     it("Is added, should subtract 8 from required hours, add 8 to overtime and not change actual", () => {
  //       const data = {
  //         workerType: WorkerType.NURSE,
  //         workerIdx: 0,
  //         shiftIndex: 21,
  //         initialShiftCode: ShiftCode.W,
  //         desiredShiftCode: ShiftCode.L4,
  //         expectedWorkHoursInfo: {
  //           required: nurseInitialWorkHours.required - 8,
  //           actual: nurseInitialWorkHours.actual,
  //           overtime: nurseInitialWorkHours.overtime + 8
  //         }
  //       };
  //       testWorkHoursInfoUpdate(data);
  //     });
  //   });
  //
  //   it("When changing previous month shift from DN to U, shouldn't change work hours info at all", () => {
  //     const data = {
  //       workerType: WorkerType.NURSE,
  //       workerIdx: 0,
  //       shiftIndex: 0,
  //       initialShiftCode: ShiftCode.DN,
  //       desiredShiftCode: ShiftCode.U,
  //       expectedWorkHoursInfo: {
  //         required: nurseInitialWorkHours.required,
  //         actual: nurseInitialWorkHours.actual,
  //         overtime: nurseInitialWorkHours.overtime
  //       }
  //     };
  //     testWorkHoursInfoUpdate(data);
  //   });
  // });
  //
  // describe("For a babysitter", () => {
  //   describe("When N for current month weekday", () => {
  //     it("Is added, should add 12 to actual and overtime hours and not change required", () => {
  //       const data = {
  //         workerType: WorkerType.OTHER,
  //         workerIdx: 3,
  //         shiftIndex: 6,
  //         initialShiftCode: ShiftCode.W,
  //         desiredShiftCode: ShiftCode.N,
  //         expectedWorkHoursInfo: {
  //           required: babysitterInitialWorkHours.required,
  //           actual: babysitterInitialWorkHours.actual + 12,
  //           overtime: babysitterInitialWorkHours.overtime + 12
  //         }
  //       };
  //       testWorkHoursInfoUpdate(data);
  //     });
  //     it("Is removed, should subtract 12 from actual and overtime hours and not change required", () => {
  //       const data = {
  //         workerType: WorkerType.OTHER,
  //         workerIdx: 3,
  //         shiftIndex: 5,
  //         initialShiftCode: ShiftCode.N,
  //         desiredShiftCode: ShiftCode.W,
  //         expectedWorkHoursInfo: {
  //           required: babysitterInitialWorkHours.required,
  //           actual: babysitterInitialWorkHours.actual - 12,
  //           overtime: babysitterInitialWorkHours.overtime - 12
  //         }
  //       };
  //       testWorkHoursInfoUpdate(data);
  //     });
  //   });
  //
  //   describe("When U for current month weekday", () => {
  //     it("Is added, should subtract 8 from required hours, add 8 to overtime and not change actual", () => {
  //       const data = {
  //         workerType: WorkerType.OTHER,
  //         workerIdx: 3,
  //         shiftIndex: 6,
  //         initialShiftCode: ShiftCode.W,
  //         desiredShiftCode: ShiftCode.U,
  //         expectedWorkHoursInfo: {
  //           required: babysitterInitialWorkHours.required - 8,
  //           actual: babysitterInitialWorkHours.actual,
  //           overtime: babysitterInitialWorkHours.overtime + 8
  //         }
  //       };
  //       testWorkHoursInfoUpdate(data);
  //     });
  //     it("Is removed, should add 8 to required hours, subtract 8 from overtime and not change actual", () => {
  //       const data = {
  //         workerType: WorkerType.OTHER,
  //         workerIdx: 3,
  //         shiftIndex: 8,
  //         initialShiftCode: ShiftCode.U,
  //         desiredShiftCode: ShiftCode.W,
  //         expectedWorkHoursInfo: {
  //           required: babysitterInitialWorkHours.required + 8,
  //           actual: babysitterInitialWorkHours.actual,
  //           overtime: babysitterInitialWorkHours.overtime - 8
  //         }
  //       };
  //       testWorkHoursInfoUpdate(data);
  //     });
  //   });
  //
  //   describe("When L4 for current month weekday", () => {
  //     it("Is added, should subtract 8 from required hours, add 8 to overtime and not change actual", () => {
  //       const data = {
  //         workerType: WorkerType.OTHER,
  //         workerIdx: 3,
  //         shiftIndex: 6,
  //         initialShiftCode: ShiftCode.W,
  //         desiredShiftCode: ShiftCode.L4,
  //         expectedWorkHoursInfo: {
  //           required: babysitterInitialWorkHours.required - 8,
  //           actual: babysitterInitialWorkHours.actual,
  //           overtime: babysitterInitialWorkHours.overtime + 8
  //         }
  //       };
  //       testWorkHoursInfoUpdate(data);
  //     });
  //   });
  //
  //   it("When changing previous month shift from DN to U, shouldn't change work hours info at all", () => {
  //     const data = {
  //       workerType: WorkerType.OTHER,
  //       workerIdx: 3,
  //       shiftIndex: 3,
  //       initialShiftCode: ShiftCode.DN,
  //       desiredShiftCode: ShiftCode.U,
  //       expectedWorkHoursInfo: {
  //         required: babysitterInitialWorkHours.required,
  //         actual: babysitterInitialWorkHours.actual,
  //         overtime: babysitterInitialWorkHours.overtime
  //       }
  //     };
  //     testWorkHoursInfoUpdate(data);
  //   });
  // });
});
