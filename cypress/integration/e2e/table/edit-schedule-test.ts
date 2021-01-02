import { GetWorkerShiftOptions } from "../../../support/commands";
import { WorkerType } from "../../../../src/common-models/worker-info.model";
import { ShiftCode } from "../../../../src/common-models/shift-info.model";
import * as _ from "lodash";
import { Simulate } from "react-dom/test-utils";
import error = Simulate.error;

interface WorkerTestCase {
  title: string;
  startShiftCell: GetWorkerShiftOptions;
  endShiftCell: GetWorkerShiftOptions;
  desiredShiftCode: ShiftCode;
}

const workerTestCases: WorkerTestCase[] = [
  {
    title: "Should be able to edit multiple days of single nurse (drag left to right)",
    startShiftCell: {
      workerType: WorkerType.NURSE,
      workerIdx: 3,
      shiftIdx: 3,
    },
    endShiftCell: {
      workerType: WorkerType.NURSE,
      workerIdx: 3,
      shiftIdx: 7,
    },
    desiredShiftCode: ShiftCode.L4,
  },
  {
    title: "Should be able to edit multiple days of single nurse (drag right to left)",
    startShiftCell: {
      workerType: WorkerType.NURSE,
      workerIdx: 3,
      shiftIdx: 7,
    },
    endShiftCell: {
      workerType: WorkerType.NURSE,
      workerIdx: 3,
      shiftIdx: 3,
    },
    desiredShiftCode: ShiftCode.U,
  },
  {
    title: "Should be able to edit multiple single day of multiple nurses",
    startShiftCell: {
      workerType: WorkerType.NURSE,
      workerIdx: 0,
      shiftIdx: 5,
    },
    endShiftCell: {
      workerType: WorkerType.NURSE,
      workerIdx: 3,
      shiftIdx: 5,
    },
    desiredShiftCode: ShiftCode.L4,
  },
  {
    title: "Should be able to edit multiple days of single babysitter",
    startShiftCell: {
      workerType: WorkerType.OTHER,
      workerIdx: 0,
      shiftIdx: 0,
    },
    endShiftCell: {
      workerType: WorkerType.OTHER,
      workerIdx: 0,
      shiftIdx: 8,
    },
    desiredShiftCode: ShiftCode.L4,
  },
  {
    title: "Should be able to edit multiple single day of multiple babysitters",
    startShiftCell: {
      workerType: WorkerType.OTHER,
      workerIdx: 3,
      shiftIdx: 3,
    },
    endShiftCell: {
      workerType: WorkerType.OTHER,
      workerIdx: 3,
      shiftIdx: 6,
    },
    desiredShiftCode: ShiftCode.L4,
  },
];

enum FoundationInfoKeys {
  EXTRA_WORKERS,
  CHILDREN,
}

interface FoundationTestCase {
  title: string;
  dataKey: FoundationInfoKeys;
  startDayIdx: number;
  endDayIdx: number;
  desiredNumber: number;
}

const foundationTestCases: FoundationTestCase[] = [
  {
    title: "Should be able to edit extra workers number with range selection",
    dataKey: FoundationInfoKeys.EXTRA_WORKERS,
    startDayIdx: 3,
    endDayIdx: 8,
    desiredNumber: 10,
  },
  {
    title: "Should be able to edit children number with range selection",
    dataKey: FoundationInfoKeys.CHILDREN,
    startDayIdx: 12,
    endDayIdx: 3,
    desiredNumber: 13,
  },
];

function validateHorizontalShifts(
  workerType: WorkerType,
  workerIdx: number,
  startShiftIdx: number,
  endShiftIdx: number,
  desiredShiftCode: ShiftCode
) {
  for (const shiftIdx of _.range(startShiftIdx, endShiftIdx)) {
    cy.checkWorkerShift({
      workerType,
      workerIdx,
      shiftIdx,
      desiredShiftCode,
    });
  }
}

function validateVerticalShifts(
  workerType: WorkerType,
  shiftIdx: number,
  startWorkerIdx: number,
  endWorkerIdx: number,
  desiredShiftCode: ShiftCode
) {
  for (const workerIdx of _.range(startWorkerIdx, endWorkerIdx)) {
    cy.checkWorkerShift({
      workerType,
      workerIdx,
      shiftIdx,
      desiredShiftCode,
    });
  }
}

function validateChange({ startShiftCell, endShiftCell, desiredShiftCode }: WorkerTestCase) {
  const {
    workerType: startWorkerType,
    workerIdx: startWorkerIdx,
    shiftIdx: startShiftIdx,
  } = startShiftCell;

  const {
    workerType: endWorkerType,
    workerIdx: endWorkerIdx,
    shiftIdx: endShiftIdx,
  } = endShiftCell;

  const isChangeHorizontal = startWorkerType === endWorkerType && startWorkerIdx === endWorkerIdx;
  const isChangeVertical = startWorkerType === endWorkerType && startShiftIdx === endShiftIdx;

  if (isChangeHorizontal) {
    validateHorizontalShifts(
      startWorkerType,
      startWorkerIdx,
      startShiftIdx,
      endShiftIdx,
      desiredShiftCode
    );
  } else if (isChangeVertical) {
    validateVerticalShifts(
      startWorkerType,
      startShiftIdx,
      startWorkerIdx,
      endWorkerIdx,
      desiredShiftCode
    );
  } else {
    cy.log("WRONG TEST SPEC");
    throw error;
  }
}

context("Shift range selection", () => {
  before(() => {
    cy.loadSchedule();
    cy.get("[data-cy=edit-mode-button]").click();
    cy.get("[data-cy=nurseShiftsTable]", { timeout: 10000 });
  });

  workerTestCases.forEach((test) => {
    it(test.title, () => {
      cy.getWorkerShift(test.startShiftCell).trigger("dragstart");
      cy.getWorkerShift(test.endShiftCell).trigger("drop");
      cy.useAutocomplete(test.desiredShiftCode);
      validateChange(test);
    });
  });

  foundationTestCases.forEach(({ title, dataKey, startDayIdx, endDayIdx, desiredNumber }) => {
    it(title, () => {
      cy.get(`[data-cy=foundationInfoSection]`)
        .children()
        .eq(dataKey)
        .children()
        .eq(startDayIdx)
        .trigger("dragstart");
      cy.get(`[data-cy=foundationInfoSection]`)
        .children()
        .eq(dataKey)
        .children()
        .eq(endDayIdx)
        .trigger("drop")
        .type(`${desiredNumber}{enter}`);
      for (const dayIdx of _.range(startDayIdx, endDayIdx)) {
        cy.get(`[data-cy=foundationInfoSection]`)
          .children()
          .eq(dataKey)
          .children()
          .eq(dayIdx)
          .contains(desiredNumber);
      }
    });
  });
});
