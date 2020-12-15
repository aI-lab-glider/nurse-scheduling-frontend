/// <reference types="cypress" />
import { ShiftHelper } from "../../../../src/helpers/shifts.helper";
import { ShiftCode, ShiftInfoModel } from "../../../../src/common-models/shift-info.model";
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

//#region caclulateWorkHoursInfo
type CaclulateWorkHoursInfoTestData = {
  dates: Pick<VerboseDate, "isPublicHoliday" | "dayOfWeek" | "month">[];
  shifts: ShiftCode[];
  workerNorm: number;
  expectedActualWorkHours: number;
  expectedRequiredHours: number;
};

// December 2019
const month = "December";
const dayCount = 31;
const holidayCount = 2; // 25 december, 26 december
const weekendCount = 9;
const workdayCount = dayCount - holidayCount - weekendCount;

const weekendTemplate = {
  month: month,
  dayOfWeek: WeekDay.SU,
  isPublicHoliday: false,
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
      ShiftCode.PN,
      ShiftCode.W,
      ShiftCode.DN,
      ShiftCode.W,
      ShiftCode.DN,
      ShiftCode.W,
      ShiftCode.D,
      ShiftCode.N,
      ShiftCode.W,
      ShiftCode.DN,
      ShiftCode.W,
      ShiftCode.DN,
      ShiftCode.W,
      ShiftCode.DN,
      ShiftCode.W,
      ShiftCode.DN,
      ShiftCode.W,
      ShiftCode.N,
      ShiftCode.W,
      ShiftCode.DN,
      ShiftCode.W,
      ShiftCode.W,
      ShiftCode.W,
      ShiftCode.W,
      ShiftCode.D,
      ShiftCode.N,
      ShiftCode.W,
      ShiftCode.W,
      ShiftCode.D,
      ShiftCode.W,
    ],
    workerNorm: 1,
    expectedActualWorkHours: 268,
    expectedRequiredHours: 160,
  },
  {
    dates: dates,
    shifts: [
      ShiftCode.D,
      ShiftCode.PN,
      ShiftCode.W,
      ShiftCode.DN,
      ShiftCode.W,
      ShiftCode.DN,
      ShiftCode.W,
      ShiftCode.D,
      ShiftCode.N,
      ShiftCode.W,
      ShiftCode.DN,
      ShiftCode.W,
      ShiftCode.DN,
      ShiftCode.W,
      ShiftCode.DN,
      ShiftCode.W,
      ShiftCode.DN,
      ShiftCode.W,
      ShiftCode.N,
      ShiftCode.W,
      ShiftCode.DN,
      ShiftCode.W,
      ShiftCode.W,
      ShiftCode.W,
      ShiftCode.W,
      ShiftCode.D,
      ShiftCode.N,
      ShiftCode.U,
      ShiftCode.U,
      ShiftCode.U,
      ShiftCode.U,
    ],
    workerNorm: 1,
    expectedActualWorkHours: 256,
    expectedRequiredHours: 128, // 160 - 4 vacation days
  },
];
//#endregion

describe("ShiftHelper", () => {
  GetWorkersCountTestCases.forEach((testCase) => {
    describe("getWorkersCount", () => {
      const shifts = Object.values(testCase.arr);
      it(`should return ${testCase.exp} for all days and array ${shifts}`, () => {
        const amount = ShiftHelper.getWorkersCount(testCase.arr);
        expect(amount).to.eql(testCase.exp);
      });
    });
  });

  CaclulateWorkHoursInfoTestCases.forEach((testCase) => {
    describe("caclulateWorkHoursInfo", () => {
      describe("for standard holidays", () => {
        const message = `${testCase.dates.length} ${testCase.shifts.length}  should calculate correct work hours for ${testCase.shifts}`;
        it(message, () => {
          const expectedOvertime =
            testCase.expectedActualWorkHours - testCase.expectedRequiredHours;
          const hours = ShiftHelper.caclulateWorkHoursInfo(
            testCase.shifts,
            testCase.workerNorm,
            testCase.dates,
            month
          );
          expect(hours).to.eql([
            testCase.expectedRequiredHours,
            testCase.expectedActualWorkHours,
            expectedOvertime,
          ]);
        });
      });
    });
  });
  describe("calculateWorkHoursInfo for case with additional holiday on Saturday", () => {
    const saturdayHoliday = {
      month: month,
      dayOfWeek: WeekDay.SA,
      isPublicHoliday: true,
    };
    const saturdayHolidayCaseWeekends = [...weekends.slice(0, -1), saturdayHoliday];
    const datesWithSaturdayHoliday = [...saturdayHolidayCaseWeekends, ...holidays, ...workDays];

    CaclulateWorkHoursInfoTestCases.forEach((testCase) => {
      it(`should subtract 8 from required hours and add 8 to overtime for ${testCase.shifts}`, () => {
        const expectedOvertime = testCase.expectedActualWorkHours - testCase.expectedRequiredHours;
        const hours = ShiftHelper.caclulateWorkHoursInfo(
          testCase.shifts,
          testCase.workerNorm,
          datesWithSaturdayHoliday,
          month
        );
        expect(hours).to.eql([
          testCase.expectedRequiredHours - 8,
          testCase.expectedActualWorkHours,
          expectedOvertime + 8,
        ]);
      });
    });
  });
});
