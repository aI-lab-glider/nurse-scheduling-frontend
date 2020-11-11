import { PublicHolidaysLogic } from "../../../../../src/logic/schedule-logic/public-holidays.logic";

// source: https://www.kalendarzswiat.pl/swieta/wolne_od_pracy/{year}
const FIXED_HOLIDAYS = [
  { day: 1, month: 1 },
  { day: 6, month: 1 },
  { day: 1, month: 5 },
  { day: 3, month: 5 },
  { day: 15, month: 8 },
  { day: 1, month: 11 },
  { day: 11, month: 11 },
  { day: 25, month: 12 },
  { day: 26, month: 12 },
];

const MOVEABLE_HOLIDAYS = {
  "2020": [
    { day: 12, month: 4 },
    { day: 13, month: 4 },
    { day: 31, month: 5 },
    { day: 11, month: 6 },
  ],
  "2021": [
    { day: 4, month: 4 },
    { day: 5, month: 4 },
    { day: 23, month: 5 },
    { day: 3, month: 6 },
  ],
  "2022": [
    { day: 17, month: 4 },
    { day: 18, month: 4 },
    { day: 5, month: 6 },
    { day: 16, month: 6 },
  ],
};

const NON_HOLIDAYS = {
  "2020": [
    { day: 2, month: 1 },
    { day: 5, month: 1 },
    { day: 7, month: 1 },
    { day: 11, month: 4 },
    { day: 14, month: 4 },
    { day: 30, month: 5 },
    { day: 10, month: 6 },
    { day: 12, month: 6 },
    { day: 2, month: 5 },
    { day: 19, month: 7 },
    { day: 24, month: 12 },
  ],
  "2021": [
    { day: 2, month: 1 },
    { day: 5, month: 1 },
    { day: 7, month: 1 },
    { day: 3, month: 4 },
    { day: 6, month: 4 },
    { day: 22, month: 5 },
    { day: 24, month: 5 },
    { day: 2, month: 6 },
    { day: 24, month: 12 },
  ],
  "2022": [
    { day: 2, month: 1 },
    { day: 5, month: 1 },
    { day: 7, month: 1 },
    { day: 16, month: 4 },
    { day: 19, month: 4 },
    { day: 4, month: 6 },
    { day: 6, month: 6 },
    { day: 15, month: 6 },
    { day: 17, month: 6 },
    { day: 5, month: 9 },
    { day: 20, month: 10 },
    { day: 24, month: 12 },
  ],
};

const YEARS_TO_TEST = ["2020", "2021", "2022"];

describe("Unit test PublicHolidayLogic", () => {
  YEARS_TO_TEST.forEach((year) => {
    testYear(year);
  });
});

function testYear(year: string): void {
  context(`for year ${year}`, () => {
    const logic = new PublicHolidaysLogic(year);

    it("should correctly see fixed holidays as holidays", () => {
      FIXED_HOLIDAYS.forEach((fixedHoliday) => {
        const { day, month } = fixedHoliday;
        const got = logic.isPublicHoliday(day, monthToInputFormat(month));
        expect(got).to.equal(true, `${formatDate(day, month, year)} is a holiday`);
      });
    });

    it("should correctly see moveable holidays as holidays", () => {
      MOVEABLE_HOLIDAYS[year].forEach((movableHoliday) => {
        const { day, month } = movableHoliday;
        const got = logic.isPublicHoliday(day, monthToInputFormat(month));
        expect(got).to.equal(true, `${formatDate(day, month, year)} is a holiday`);
      });
    });

    it("shouldn't see non-holidays as holidays", () => {
      NON_HOLIDAYS[year].forEach((nonHoliday) => {
        const { day, month } = nonHoliday;
        const got = logic.isPublicHoliday(day, monthToInputFormat(month));
        expect(got).to.equal(false, `${formatDate(day, month, year)} is not a holiday`);
      });
    });
  });
}

function monthToInputFormat(month: number): number {
  return month - 1;
}

function formatDate(day: number, month: number, year: string): string {
  return `${day.toString()}.${month.toString()}.${year}`;
}
