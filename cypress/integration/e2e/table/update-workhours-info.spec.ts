import { WorkerType } from "../../../../src/common-models/worker-info.model";
import { ShiftCode } from "../../../../src/common-models/shift-info.model";
import { HoursInfo, HoursInfoCells } from "../../../support/commands";

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

async function testWorkHoursInfoUpdate({
  workerType,
  workerIdx,
  shiftIndex,
  initialShiftCode,
  desiredShiftCode,
  expectedWorkHoursInfo,
}: TestCase) {
  const workerData = {
    workerType: workerType,
    workerIdx: workerIdx,
    shiftIdx: shiftIndex,
  };
  cy.getWorkerShift(workerData).contains(initialShiftCode);

  cy.changeWorkerShift({ ...workerData, newShiftCode: desiredShiftCode });
  cy.getWorkerShift(workerData).contains(desiredShiftCode);

  cy.checkHoursInfo({ workerType, workerIdx, hoursInfo: expectedWorkHoursInfo });
}

context("Work hours info (summary table)", () => {
  // sanity check in case schedule in the docs gets changed and these tests start failing because of it
  before("Has expected initial values of workHourInfo in example schedule", () => {
    cy.loadSchedule();

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

  beforeEach(() => {
    cy.loadSchedule();
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

    testWorkHoursInfoUpdate(data);
  });

  it("Is removed, should subtract 12 from actual and overtime hours and not change required", () => {
    const data = {
      workerType: WorkerType.NURSE,
      workerIdx: 0,
      shiftIndex: 9,
      initialShiftCode: ShiftCode.D,
      desiredShiftCode: ShiftCode.W,
      expectedWorkHoursInfo: {
        [HoursInfoCells.required]: nurseInitialWorkHours[HoursInfoCells.required],
        [HoursInfoCells.actual]: nurseInitialWorkHours[HoursInfoCells.actual] - 12,
        [HoursInfoCells.overtime]: nurseInitialWorkHours[HoursInfoCells.overtime] - 12,
      },
    };
    testWorkHoursInfoUpdate(data);
  });

  it("When U for current month weekday is added, should subtract 8 from required hours, add 8 to overtime and not change actual", () => {
    const data = {
      workerType: WorkerType.NURSE,
      workerIdx: 0,
      shiftIndex: 21,
      initialShiftCode: ShiftCode.W,
      desiredShiftCode: ShiftCode.U,
      expectedWorkHoursInfo: {
        [HoursInfoCells.required]: nurseInitialWorkHours[HoursInfoCells.required] - 8,
        [HoursInfoCells.actual]: nurseInitialWorkHours[HoursInfoCells.actual],
        [HoursInfoCells.overtime]: nurseInitialWorkHours[HoursInfoCells.overtime] + 8,
      },
    };
    testWorkHoursInfoUpdate(data);
  });
  it("When U for current month weekday is removed, should add 8 to required hours, subtract 8 from overtime and not change actual", () => {
    const data = {
      workerType: WorkerType.NURSE,
      workerIdx: 0,
      shiftIndex: 6,
      initialShiftCode: ShiftCode.U,
      desiredShiftCode: ShiftCode.W,
      expectedWorkHoursInfo: {
        [HoursInfoCells.required]: nurseInitialWorkHours[HoursInfoCells.required] + 8,
        [HoursInfoCells.actual]: nurseInitialWorkHours[HoursInfoCells.actual],
        [HoursInfoCells.overtime]: nurseInitialWorkHours[HoursInfoCells.overtime] - 8,
      },
    };
    testWorkHoursInfoUpdate(data);
  });

  it("When L4 for current month weekday is added, should subtract 8 from required hours, add 8 to overtime and not change actual", () => {
    const data = {
      workerType: WorkerType.NURSE,
      workerIdx: 0,
      shiftIndex: 21,
      initialShiftCode: ShiftCode.W,
      desiredShiftCode: ShiftCode.L4,
      expectedWorkHoursInfo: {
        [HoursInfoCells.required]: nurseInitialWorkHours[HoursInfoCells.required] - 8,
        [HoursInfoCells.actual]: nurseInitialWorkHours[HoursInfoCells.actual],
        [HoursInfoCells.overtime]: nurseInitialWorkHours[HoursInfoCells.overtime] + 8,
      },
    };
    testWorkHoursInfoUpdate(data);
  });

  it("When changing previous month shift from DN to U, shouldn't change work hours info at all", () => {
    const data = {
      workerType: WorkerType.NURSE,
      workerIdx: 0,
      shiftIndex: 0,
      initialShiftCode: ShiftCode.DN,
      desiredShiftCode: ShiftCode.U,
      expectedWorkHoursInfo: {
        [HoursInfoCells.required]: nurseInitialWorkHours[HoursInfoCells.required],
        [HoursInfoCells.actual]: nurseInitialWorkHours[HoursInfoCells.actual],
        [HoursInfoCells.overtime]: nurseInitialWorkHours[HoursInfoCells.overtime],
      },
    };
    testWorkHoursInfoUpdate(data);
  });

  it("When N for current month weekday is added, should add 12 to actual and overtime hours and not change required", () => {
    const data = {
      workerType: WorkerType.OTHER,
      workerIdx: 3,
      shiftIndex: 6,
      initialShiftCode: ShiftCode.W,
      desiredShiftCode: ShiftCode.N,
      expectedWorkHoursInfo: {
        [HoursInfoCells.required]: babysitterInitialWorkHours[HoursInfoCells.required],
        [HoursInfoCells.actual]: babysitterInitialWorkHours[HoursInfoCells.actual] + 12,
        [HoursInfoCells.overtime]: babysitterInitialWorkHours[HoursInfoCells.overtime] + 12,
      },
    };
    testWorkHoursInfoUpdate(data);
  });
  it("Is removed, should subtract 12 from actual and overtime hours and not change required", () => {
    const data = {
      workerType: WorkerType.OTHER,
      workerIdx: 3,
      shiftIndex: 5,
      initialShiftCode: ShiftCode.N,
      desiredShiftCode: ShiftCode.W,
      expectedWorkHoursInfo: {
        [HoursInfoCells.required]: babysitterInitialWorkHours[HoursInfoCells.required],
        [HoursInfoCells.actual]: babysitterInitialWorkHours[HoursInfoCells.actual] - 12,
        [HoursInfoCells.overtime]: babysitterInitialWorkHours[HoursInfoCells.overtime] - 12,
      },
    };
    testWorkHoursInfoUpdate(data);
  });

  it("When U for current month weekday is added, should subtract 8 from required hours, add 8 to overtime and not change actual", () => {
    const data = {
      workerType: WorkerType.OTHER,
      workerIdx: 3,
      shiftIndex: 6,
      initialShiftCode: ShiftCode.W,
      desiredShiftCode: ShiftCode.U,
      expectedWorkHoursInfo: {
        [HoursInfoCells.required]: babysitterInitialWorkHours[HoursInfoCells.required] - 8,
        [HoursInfoCells.actual]: babysitterInitialWorkHours[HoursInfoCells.actual],
        [HoursInfoCells.overtime]: babysitterInitialWorkHours[HoursInfoCells.overtime] + 8,
      },
    };
    testWorkHoursInfoUpdate(data);
  });
  it("When U for current month weekday is removed, should add 8 to required hours, subtract 8 from overtime and not change actual", () => {
    const data = {
      workerType: WorkerType.OTHER,
      workerIdx: 3,
      shiftIndex: 8,
      initialShiftCode: ShiftCode.U,
      desiredShiftCode: ShiftCode.W,
      expectedWorkHoursInfo: {
        [HoursInfoCells.required]: babysitterInitialWorkHours[HoursInfoCells.required] + 8,
        [HoursInfoCells.actual]: babysitterInitialWorkHours[HoursInfoCells.actual],
        [HoursInfoCells.overtime]: babysitterInitialWorkHours[HoursInfoCells.overtime] - 8,
      },
    };
    testWorkHoursInfoUpdate(data);
  });

  it("When L4 for current month weekday is added, should subtract 8 from required hours, add 8 to overtime and not change actual", () => {
    const data = {
      workerType: WorkerType.OTHER,
      workerIdx: 3,
      shiftIndex: 6,
      initialShiftCode: ShiftCode.W,
      desiredShiftCode: ShiftCode.L4,
      expectedWorkHoursInfo: {
        [HoursInfoCells.required]: babysitterInitialWorkHours[HoursInfoCells.required] - 8,
        [HoursInfoCells.actual]: babysitterInitialWorkHours[HoursInfoCells.actual],
        [HoursInfoCells.overtime]: babysitterInitialWorkHours[HoursInfoCells.overtime] + 8,
      },
    };
    testWorkHoursInfoUpdate(data);
  });

  it("When changing previous month shift from DN to U, shouldn't change work hours info at all", () => {
    const data = {
      workerType: WorkerType.OTHER,
      workerIdx: 3,
      shiftIndex: 3,
      initialShiftCode: ShiftCode.DN,
      desiredShiftCode: ShiftCode.U,
      expectedWorkHoursInfo: {
        [HoursInfoCells.required]: babysitterInitialWorkHours[HoursInfoCells.required],
        [HoursInfoCells.actual]: babysitterInitialWorkHours[HoursInfoCells.actual],
        [HoursInfoCells.overtime]: babysitterInitialWorkHours[HoursInfoCells.overtime],
      },
    };
    testWorkHoursInfoUpdate(data);
  });
});
