import { PublicHolidaysLogic } from "../../../../../src/logic/schedule-logic/public-holidays.logic";

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

const MOVEABLE_HOLIDAYS = [
  { day: 12, month: 4 },
  { day: 13, month: 4 },
  { day: 31, month: 5 },
  { day: 11, month: 6 },
];

describe("Public holiday logic for 2020", () => {
  const logic = new PublicHolidaysLogic("2020");

  it("should correctly see fixed holidays as holidays", () => {
    FIXED_HOLIDAYS.forEach((fixedHoliday) => {
      const { day, month } = fixedHoliday;
      const got = logic.isPublicHoliday(day, monthToInputFormat(month));
      expect(got).to.equal(true);
    });
  });

  it("should correctly see moveable holidays as holidays", () => {
    MOVEABLE_HOLIDAYS.forEach((movableHoliday) => {
      const { day, month } = movableHoliday;
      const got = logic.isPublicHoliday(day, monthToInputFormat(month));
      expect(got).to.equal(true);
    });
  });
});

function monthToInputFormat(month: number): number {
  return month - 1;
}
