/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import { ShiftHelper } from "../../../../src/helpers/shifts.helper";
import { ShiftCode, ShiftInfoModel, SHIFTS } from "../../../../src/common-models/shift-info.model";
import { VerboseDate, WeekDay } from "../../../../src/common-models/month-info.model";

//#region getWorkersCount data
type GetWorkersCountTestCase = { arr: ShiftInfoModel; exp: Array<number> };

const testData1: ShiftInfoModel = {
  "0": ["R", "DN", "W"].map((d) => ShiftCode[d]),
  "1": ["P", "D", "W"].map((d) => ShiftCode[d]),
  "2": ["D", "W", "W"].map((d) => ShiftCode[d]),
};

const testData2: ShiftInfoModel = {
  "0": ["W", "W", "W"].map((d) => ShiftCode[d]),
  "1": ["W", "W", "W"].map((d) => ShiftCode[d]),
  "2": ["W", "W", "W"].map((d) => ShiftCode[d]),
};

const testData3: ShiftInfoModel = {
  "0": ["R", "R", "R"].map((d) => ShiftCode[d]),
  "1": ["R", "R", "R"].map((d) => ShiftCode[d]),
  "2": ["R", "R", "R"].map((d) => ShiftCode[d]),
};

const testData4: ShiftInfoModel = {
  "0": ["R", "W", "R", "W"].map((d) => ShiftCode[d]),
  "1": ["R", "R", "R", "W"].map((d) => ShiftCode[d]),
  "2": ["R", "W", "R", "R"].map((d) => ShiftCode[d]),
};
const testData5: ShiftInfoModel = {
  "0": ["R", "W", "R", "W"].map((d) => ShiftCode[d]),
  "1": ["R", "R", "R", "W"].map((d) => ShiftCode[d]),
  "2": ["P", "R", "R", "R"].map((d) => ShiftCode[d]),
  "3": ["R", "W", "P", "R"].map((d) => ShiftCode[d]),
  "4": ["D", "W", "R", "R"].map((d) => ShiftCode[d]),
};

const GetWorkersCountTestCases: GetWorkersCountTestCase[] = [
  {
    arr: testData1,
    exp: [3, 2, 0],
  },
  {
    arr: testData2,
    exp: [0, 0, 0],
  },
  {
    arr: testData3,
    exp: [3, 3, 3],
  },
  {
    arr: testData4,
    exp: [3, 1, 3, 1],
  },
  {
    arr: testData5,
    exp: [5, 2, 5, 3],
  },
];
//#endregion

type DateArray = Pick<VerboseDate, "isPublicHoliday" | "dayOfWeek" | "month">[];

//#region caclulateWorkHoursInfo
type CaclulateWorkHoursInfoTestData = {
  dates: DateArray;
  shifts: ShiftCode[];
  workerNorm: number;
  expectedActualWorkHours: number;
  expectedRequiredHours: number;
};

const month = "February";
const dayCount = 28;
const holidayCount = 0;
const weekendCount = 8;
const workdayCount = dayCount - holidayCount - weekendCount;

const weekendTemplate = {
  month: month,
  dayOfWeek: WeekDay.SU,
  isPublicHoliday: false,
};

const saturdayHolidayTemplate = {
  month: month,
  dayOfWeek: WeekDay.SA,
  isPublicHoliday: true,
};

const holidayTemplate = {
  month: month,
  dayOfWeek: WeekDay.SU,
  isPublicHoliday: true,
};
const workDayTemplate = {
  month: month,
  dayOfWeek: WeekDay.MO,
  isPublicHoliday: false,
};

const weekends = [...Array.from(Array(weekendCount))].map((_) => weekendTemplate);
const holidays = [...Array.from(Array(holidayCount))].map((_) => holidayTemplate);
const workDays = [...Array.from(Array(workdayCount))].map((_) => workDayTemplate);
const dates = [...weekends, ...holidays, ...workDays];
const CaclulateWorkHoursInfoTestCases: CaclulateWorkHoursInfoTestData[] = [
  {
    dates: dates,
    shifts: [
      ShiftCode.D,
      ShiftCode.N,
      ShiftCode.W,
      ShiftCode.W,
      ShiftCode.D,
      ShiftCode.N,
      ShiftCode.N,
      ShiftCode.W,
      ShiftCode.D,
      ShiftCode.RP,
      ShiftCode.N,
      ShiftCode.W,
      ShiftCode.D,
      ShiftCode.N,
      ShiftCode.W,
      ShiftCode.W,
      ShiftCode.D,
      ShiftCode.N,
      ShiftCode.W,
      ShiftCode.W,
      ShiftCode.D,
      ShiftCode.N,
      ShiftCode.W,
      ShiftCode.W,
      ShiftCode.D,
      ShiftCode.W,
      ShiftCode.W,
      ShiftCode.W,
    ],
    workerNorm: 1,
    expectedActualWorkHours: 180,
    expectedRequiredHours: 160,
  },
];

//#endregion

describe("ShiftHelper", () => {
  const expectedHours = {
    [ShiftCode.RP]: 12,
    [ShiftCode.RPN]: 24,
    [ShiftCode.N8]: 8,
    [ShiftCode.RN8]: 17,
    [ShiftCode.DN8]: 21,
    [ShiftCode.D1]: 10,
    [ShiftCode.D2]: 9,
    [ShiftCode.P1]: 6,
    [ShiftCode.R1]: 6,
    [ShiftCode.R]: 8,
    [ShiftCode.P]: 4,
    [ShiftCode.D]: 12,
    [ShiftCode.N]: 12,
    [ShiftCode.DN]: 24,
    [ShiftCode.PN]: 16,
    [ShiftCode.W]: 0,
    [ShiftCode.U]: 0,
    [ShiftCode.L4]: 0,
    [ShiftCode.K]: 0,
    [ShiftCode.OP]: 0,
    [ShiftCode.OK]: 0,
    [ShiftCode.NZ]: 0,
  };

  Object.values(SHIFTS).forEach((shift) => {
    it(`Should calculate correct duration ${shift.code}`, () => {
      const shiftCode = ShiftCode[shift.code];
      const hours = ShiftHelper.shiftCodeToWorkTime(shift);
      expect(hours).to.equal(expectedHours[shiftCode]);
    });
  });

  it("Should calculate correct work hours for month", () => {
    const workNorm = ShiftHelper.calculateWorkNormForMonth(10, 2020);
    expect(workNorm).to.equal(160);
  });

  GetWorkersCountTestCases.forEach((testCase) => {
    describe("getWorkersCount", () => {
      const shifts = Object.values(testCase.arr);
      it(`should return ${testCase.exp} for all days and array ${shifts}`, () => {
        const amount = ShiftHelper.getWorkersCount(testCase.arr);
        expect(amount).to.eql(testCase.exp);
      });
    });
  });

  describe("caclulateWorkHoursInfo", () => {
    describe("for standard holidays", () => {
      CaclulateWorkHoursInfoTestCases.forEach((testCase) => {
        const message = `${testCase.dates.length} ${testCase.shifts.length}  should calculate correct work hours for ${testCase.shifts}`;
        it(message, () => {
          const expectedOvertime =
            testCase.expectedActualWorkHours - testCase.expectedRequiredHours;
          testForCorrectWorkHourCalculation(testCase, expectedOvertime);
        });
      });
    });

    describe("for cases with additional holiday on Saturday", () => {
      describe("for case with 1 such holiday", () => {
        const saturdayHolidayCaseWeekends = [...weekends.slice(0, -1), saturdayHolidayTemplate];
        const datesWithSaturdayHoliday = [...saturdayHolidayCaseWeekends, ...holidays, ...workDays];

        CaclulateWorkHoursInfoTestCases.forEach((testCase) => {
          it(`should subtract 8 from required hours and add 8 to overtime for ${testCase.shifts}`, () => {
            const expectedOvertime =
              testCase.expectedActualWorkHours - testCase.expectedRequiredHours;
            testForCorrectWorkHourCalculation(
              testCase,
              expectedOvertime + 8,
              testCase.expectedRequiredHours - 8,
              datesWithSaturdayHoliday
            );
          });
        });
      });

      describe("for case with 3 such holidays", () => {
        const saturdayHolidayCaseWeekends = [
          ...weekends.slice(0, -3),
          saturdayHolidayTemplate,
          saturdayHolidayTemplate,
          saturdayHolidayTemplate,
        ];
        const datesWithSaturdayHoliday = [...saturdayHolidayCaseWeekends, ...holidays, ...workDays];

        CaclulateWorkHoursInfoTestCases.forEach((testCase) => {
          it(`should subtract 24 from required hours and add 24 to overtime for ${testCase.shifts}`, () => {
            const expectedOvertime =
              testCase.expectedActualWorkHours - testCase.expectedRequiredHours;
            testForCorrectWorkHourCalculation(
              testCase,
              expectedOvertime + 24,
              testCase.expectedRequiredHours - 24,
              datesWithSaturdayHoliday
            );
          });
        });
      });
    });
  });
});

function testForCorrectWorkHourCalculation(
  testCase: CaclulateWorkHoursInfoTestData,
  expectedOvertimeHours: number,
  expectedRequiredHours?: number,
  dates?: DateArray
): void {
  const hours = ShiftHelper.caclulateWorkHoursInfo(
    testCase.shifts,
    testCase.workerNorm,
    dates ? dates : testCase.dates,
    month
  );
  expect(hours).to.eql([
    expectedRequiredHours ? expectedRequiredHours : testCase.expectedRequiredHours,
    testCase.expectedActualWorkHours,
    expectedOvertimeHours,
  ]);
}
