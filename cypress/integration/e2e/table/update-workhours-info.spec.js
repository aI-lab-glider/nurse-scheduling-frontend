/* eslint-disable @typescript-eslint/explicit-function-return-type */
/// <reference types="cypress" />

const nurseInitialWorkHours = { required: 136, actual: 164, overtime: 28 };
const babysitterInitialWorkHours = { required: 80, actual: 108, overtime: 28 };

const workerTypeToIdx = {
  nurse: 0,
  babysitter: 3,
};

function shiftCell(workerType, shiftIdx) {
  return cy
    .get(`[data-cy="${workerType}ShiftsTable"]`)
    .children()
    .children()
    .eq(workerTypeToIdx[workerType])
    .children()
    .eq(shiftIdx)
    .children()
    .children();
}

const cellTypeToIdx = {
  required: 0,
  actual: 1,
  overtime: 2,
};

function hoursInfoCell(workerType, cellType) {
  return cy
    .get(`[data-cy="${workerType}SummaryTable"]`)
    .children()
    .children()
    .eq(workerTypeToIdx[workerType])
    .children()
    .eq(cellTypeToIdx[cellType]);
}

function testWorkHoursInfoUpdate(testData) {
  const cellData = [testData.workerType, testData.shiftIndex];

  if (testData.initialShiftCode) {
    shiftCell(...cellData).contains(testData.initialShiftCode);
    shiftCell(...cellData).click();
  } else {
    shiftCell(...cellData)
      .parent()
      .click();
  }
  cy.get('[data-cy="shiftDropdown"]').contains(testData.desiredShiftText).click({ force: true });

  if (testData.desiredShiftCode) {
    shiftCell(...cellData).contains(testData.desiredShiftCode);
  } else {
    shiftCell(...cellData).should("be.empty");
  }

  hoursInfoCell(testData.workerType, "required").contains(testData.expectedWorkHoursInfo.required);
  hoursInfoCell(testData.workerType, "actual").contains(testData.expectedWorkHoursInfo.actual);
  hoursInfoCell(testData.workerType, "overtime").contains(testData.expectedWorkHoursInfo.overtime);
}

context("Work hours info (summary table)", () => {
  beforeEach(() => {
    cy.visit(Cypress.env("baseUrl"));
    cy.contains("Plik").click();
    cy.get('[data-cy="file-input"]').attachFile("example.xlsx");
  });

  // sanity check in case schedule in the docs gets changed and these tests start failing because of it
  it("Has expected initial values of workHourInfo in example schedule", () => {
    hoursInfoCell("nurse", "required").contains(nurseInitialWorkHours.required);
    hoursInfoCell("nurse", "actual").contains(nurseInitialWorkHours.actual);
    hoursInfoCell("nurse", "overtime").contains(nurseInitialWorkHours.overtime);

    hoursInfoCell("babysitter", "required").contains(babysitterInitialWorkHours.required);
    hoursInfoCell("babysitter", "actual").contains(babysitterInitialWorkHours.actual);
    hoursInfoCell("babysitter", "overtime").contains(babysitterInitialWorkHours.overtime);
  });

  describe("For a nurse", () => {
    describe("When D for current month weekday", () => {
      it("Is added, should add 12 to actual and overtime hours and not change required", () => {
        const data = {
          workerType: "nurse",
          shiftIndex: 21,
          initialShiftCode: null,
          desiredShiftText: "dzień",
          desiredShiftCode: "D",
          expectedWorkHoursInfo: {
            required: nurseInitialWorkHours.required,
            actual: nurseInitialWorkHours.actual + 12,
            overtime: nurseInitialWorkHours.overtime + 12,
          },
        };
        testWorkHoursInfoUpdate(data);
      });
      it("Is removed, should subtract 12 from actual and overtime hours and not change required", () => {
        const data = {
          workerType: "nurse",
          shiftIndex: 9,
          initialShiftCode: "D",
          desiredShiftText: "wolne",
          desiredShiftCode: null,
          expectedWorkHoursInfo: {
            required: nurseInitialWorkHours.required,
            actual: nurseInitialWorkHours.actual - 12,
            overtime: nurseInitialWorkHours.overtime - 12,
          },
        };
        testWorkHoursInfoUpdate(data);
      });
    });

    describe("When U for current month weekday", () => {
      it("Is added, should subtract 8 from required hours, add 8 to overtime and not change actual", () => {
        const data = {
          workerType: "nurse",
          shiftIndex: 21,
          initialShiftCode: null,
          desiredShiftText: "urlop",
          desiredShiftCode: "U",
          expectedWorkHoursInfo: {
            required: nurseInitialWorkHours.required - 8,
            actual: nurseInitialWorkHours.actual,
            overtime: nurseInitialWorkHours.overtime + 8,
          },
        };
        testWorkHoursInfoUpdate(data);
      });
      it("Is removed, should add 8 to required hours, subtract 8 from overtime and not change actual", () => {
        const data = {
          workerType: "nurse",
          shiftIndex: 6,
          initialShiftCode: "U",
          desiredShiftText: "wolne",
          desiredShiftCode: null,
          expectedWorkHoursInfo: {
            required: nurseInitialWorkHours.required + 8,
            actual: nurseInitialWorkHours.actual,
            overtime: nurseInitialWorkHours.overtime - 8,
          },
        };
        testWorkHoursInfoUpdate(data);
      });
    });

    describe("When L4 for current month weekday", () => {
      it("Is added, should subtract 8 from required hours, add 8 to overtime and not change actual", () => {
        const data = {
          workerType: "nurse",
          shiftIndex: 21,
          initialShiftCode: null,
          desiredShiftText: "L4",
          desiredShiftCode: "L4",
          expectedWorkHoursInfo: {
            required: nurseInitialWorkHours.required - 8,
            actual: nurseInitialWorkHours.actual,
            overtime: nurseInitialWorkHours.overtime + 8,
          },
        };
        testWorkHoursInfoUpdate(data);
      });
    });

    describe("When U for current month weekend", () => {
      it("Is added, should subtract 8 from required hours, add 8 to overtime and not change actual", () => {
        const data = {
          workerType: "nurse",
          shiftIndex: 10,
          initialShiftCode: null,
          desiredShiftText: "urlop",
          desiredShiftCode: "U",
          expectedWorkHoursInfo: {
            required: nurseInitialWorkHours.required - 8,
            actual: nurseInitialWorkHours.actual,
            overtime: nurseInitialWorkHours.overtime + 8,
          },
        };
        testWorkHoursInfoUpdate(data);
      });
      it("Is removed, should add 8 to required hours, subtract 8 from overtime and not change actual", () => {
        const data = {
          workerType: "nurse",
          shiftIndex: 4,
          initialShiftCode: "U",
          desiredShiftText: "wolne",
          desiredShiftCode: null,
          expectedWorkHoursInfo: {
            required: nurseInitialWorkHours.required + 8,
            actual: nurseInitialWorkHours.actual,
            overtime: nurseInitialWorkHours.overtime - 8,
          },
        };
        testWorkHoursInfoUpdate(data);
      });
    });

    it("When changing previous month shift from DN to U, shouldn't change work hours info at all", () => {
      const data = {
        workerType: "nurse",
        shiftIndex: 0,
        initialShiftCode: "DN",
        desiredShiftText: "urlop",
        desiredShiftCode: "U",
        expectedWorkHoursInfo: {
          required: nurseInitialWorkHours.required,
          actual: nurseInitialWorkHours.actual,
          overtime: nurseInitialWorkHours.overtime,
        },
      };
      testWorkHoursInfoUpdate(data);
    });
  });

  describe("For a babysitter", () => {
    describe("When N for current month weekday", () => {
      it("Is added, should add 12 to actual and overtime hours and not change required", () => {
        const data = {
          workerType: "babysitter",
          shiftIndex: 6,
          initialShiftCode: null,
          desiredShiftText: "noc",
          desiredShiftCode: "N",
          expectedWorkHoursInfo: {
            required: babysitterInitialWorkHours.required,
            actual: babysitterInitialWorkHours.actual + 12,
            overtime: babysitterInitialWorkHours.overtime + 12,
          },
        };
        testWorkHoursInfoUpdate(data);
      });
      it("Is removed, should subtract 12 from actual and overtime hours and not change required", () => {
        const data = {
          workerType: "babysitter",
          shiftIndex: 5,
          initialShiftCode: "N",
          desiredShiftText: "wolne",
          desiredShiftCode: null,
          expectedWorkHoursInfo: {
            required: babysitterInitialWorkHours.required,
            actual: babysitterInitialWorkHours.actual - 12,
            overtime: babysitterInitialWorkHours.overtime - 12,
          },
        };
        testWorkHoursInfoUpdate(data);
      });
    });

    describe("When U for current month weekday", () => {
      it("Is added, should subtract 8 from required hours, add 8 to overtime and not change actual", () => {
        const data = {
          workerType: "babysitter",
          shiftIndex: 6,
          initialShiftCode: null,
          desiredShiftText: "urlop",
          desiredShiftCode: "U",
          expectedWorkHoursInfo: {
            required: babysitterInitialWorkHours.required - 8,
            actual: babysitterInitialWorkHours.actual,
            overtime: babysitterInitialWorkHours.overtime + 8,
          },
        };
        testWorkHoursInfoUpdate(data);
      });
      it("Is removed, should add 8 to required hours, subtract 8 from overtime and not change actual", () => {
        const data = {
          workerType: "babysitter",
          shiftIndex: 8,
          initialShiftCode: "U",
          desiredShiftText: "wolne",
          desiredShiftCode: null,
          expectedWorkHoursInfo: {
            required: babysitterInitialWorkHours.required + 8,
            actual: babysitterInitialWorkHours.actual,
            overtime: babysitterInitialWorkHours.overtime - 8,
          },
        };
        testWorkHoursInfoUpdate(data);
      });
    });

    describe("When L4 for current month weekday", () => {
      it("Is added, should subtract 8 from required hours, add 8 to overtime and not change actual", () => {
        const data = {
          workerType: "babysitter",
          shiftIndex: 6,
          initialShiftCode: null,
          desiredShiftText: "L4",
          desiredShiftCode: "L4",
          expectedWorkHoursInfo: {
            required: babysitterInitialWorkHours.required - 8,
            actual: babysitterInitialWorkHours.actual,
            overtime: babysitterInitialWorkHours.overtime + 8,
          },
        };
        testWorkHoursInfoUpdate(data);
      });
    });

    describe("When U for current month weekend", () => {
      it("Is added, should subtract 8 from required hours, add 8 to overtime and not change actual", () => {
        const data = {
          workerType: "babysitter",
          shiftIndex: 31,
          initialShiftCode: null,
          desiredShiftText: "urlop",
          desiredShiftCode: "U",
          expectedWorkHoursInfo: {
            required: babysitterInitialWorkHours.required - 8,
            actual: babysitterInitialWorkHours.actual,
            overtime: babysitterInitialWorkHours.overtime + 8,
          },
        };
        testWorkHoursInfoUpdate(data);
      });
      it("Is removed, should add 8 to required hours, subtract 8 from overtime and not change actual", () => {
        const data = {
          workerType: "babysitter",
          shiftIndex: 10,
          initialShiftCode: "U",
          desiredShiftText: "wolne",
          desiredShiftCode: null,
          expectedWorkHoursInfo: {
            required: babysitterInitialWorkHours.required + 8,
            actual: babysitterInitialWorkHours.actual,
            overtime: babysitterInitialWorkHours.overtime - 8,
          },
        };
        testWorkHoursInfoUpdate(data);
      });
    });

    it("When changing previous month shift from DN to U, shouldn't change work hours info at all", () => {
      const data = {
        workerType: "babysitter",
        shiftIndex: 3,
        initialShiftCode: "DN",
        desiredShiftText: "urlop",
        desiredShiftCode: "U",
        expectedWorkHoursInfo: {
          required: babysitterInitialWorkHours.required,
          actual: babysitterInitialWorkHours.actual,
          overtime: babysitterInitialWorkHours.overtime,
        },
      };
      testWorkHoursInfoUpdate(data);
    });
  });
});
