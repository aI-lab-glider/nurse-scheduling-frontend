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
];
//#endregion

//#region caclulateWorkHoursInfo
type CaclulateWorkHoursInfoTestData = {
  dates: VerboseDate[];
  currentMonth: string;
  shifts: ShiftCode[];
  workerNorm: number;
  expectedActualWorkHours: number;
  expectedRequiredHours: number;
};

const currentMonth = "month";
const currentDate = 0;
const verboseDates: VerboseDate[] = [
  {
    isPublicHoliday: false,
    dayOfWeek: WeekDay.TH,
    month: currentMonth,
    date: currentDate,
  },
  {
    isPublicHoliday: true,
    dayOfWeek: WeekDay.FR,
    month: currentMonth,
    date: currentDate + 1,
  },
  {
    isPublicHoliday: false,
    dayOfWeek: WeekDay.SA,
    month: currentMonth,
    date: currentDate + 2,
  },
];

const requiredWorkTime = 8;
const commonParams = {
  dates: verboseDates,
  currentMonth: currentMonth,
};
const CaclulateWorkHoursInfoTestCases: CaclulateWorkHoursInfoTestData[] = [
  {
    ...commonParams,
    shifts: [ShiftCode.U, ShiftCode.U, ShiftCode.U],
    workerNorm: 1,
    expectedActualWorkHours: 0,
    expectedRequiredHours: 0,
  },
  {
    ...commonParams,
    shifts: [ShiftCode.R, ShiftCode.U, ShiftCode.U],
    workerNorm: 1,
    expectedActualWorkHours: ShiftHelper.shiftCodeToWorkTime(ShiftCode.R),
    expectedRequiredHours: requiredWorkTime,
  },
  {
    ...commonParams,
    shifts: [ShiftCode.R, ShiftCode.R, ShiftCode.R],
    workerNorm: 1,
    expectedActualWorkHours: 3 * ShiftHelper.shiftCodeToWorkTime(ShiftCode.R),
    expectedRequiredHours: requiredWorkTime,
  },
  {
    ...commonParams,
    shifts: [ShiftCode.R, ShiftCode.R, ShiftCode.U],
    workerNorm: 0.5,
    expectedActualWorkHours: 0.5 * 2 * ShiftHelper.shiftCodeToWorkTime(ShiftCode.R),
    expectedRequiredHours: 0.5 * requiredWorkTime,
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
      const message = `should calculate correct work hours for ${
        testCase.shifts
      } in days ${testCase.dates.map((d) => `${d.dayOfWeek}, is holiday: ${d.isPublicHoliday}`)}`;
      it(message, () => {
        const expectedOvertime = testCase.expectedActualWorkHours - testCase.expectedRequiredHours;
        const hours = ShiftHelper.caclulateWorkHoursInfo(
          testCase.shifts,
          testCase.workerNorm,
          testCase.dates,
          testCase.currentMonth
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
