import {
  calculateMissingFullWeekDays,
  daysInMonth,
} from "../../../../../src/state/reducers/month-state/schedule-data/common-reducers";
import { ScheduleKey } from "../../../../../src/api/persistance-store.model";
import { numberOfWeeksInMonth } from "../../../../support/commands";

interface TestCase {
  title: string;
  monthNumber: number;
  year: number;
  dayInMonth: number;
  missingDaysToFullWeek: {
    prevMonth: number;
    nextMonth: number;
  };
}

const testCases: TestCase[] = [
  {
    title: "january (31 days)",
    monthNumber: 0,
    year: 2021,
    dayInMonth: 31,
    missingDaysToFullWeek: {
      prevMonth: 4,
      nextMonth: 0,
    },
  },
  {
    title: "month consisting only of full weeks",
    monthNumber: 1,
    year: 2021,
    dayInMonth: 28,
    missingDaysToFullWeek: {
      prevMonth: 0,
      nextMonth: 0,
    },
  },
  {
    title: "february with leap day (29 days)",
    monthNumber: 1,
    year: 2020,
    dayInMonth: 29,
    missingDaysToFullWeek: {
      prevMonth: 5,
      nextMonth: 1,
    },
  },
];

describe("Schedule preprocessor functions", () => {
  testCases.forEach((test) => {
    it(`Should calculate proper month length for ${test.title}`, () => {
      const days = daysInMonth(test.monthNumber, test.year);
      cy.log(`${days}`);
      expect(days.length).eql(test.dayInMonth);
    });

    it(`Should calculate how many days are missing from previous and next month to create full weeks for ${test.title}`, () => {
      const [prev, next] = calculateMissingFullWeekDays(
        new ScheduleKey(test.monthNumber, test.year)
      );
      expect(prev).eql(test.missingDaysToFullWeek.prevMonth);
      expect(next).eql(test.missingDaysToFullWeek.nextMonth);
    });
  });

  it(`Should calculate proper weeks number for different months`, () => {
    expect(numberOfWeeksInMonth(0, 2021)).eql(5);
    expect(numberOfWeeksInMonth(1, 2021)).eql(4);
    expect(numberOfWeeksInMonth(2, 2021)).eql(5);
    expect(numberOfWeeksInMonth(3, 2021)).eql(5);
    expect(numberOfWeeksInMonth(4, 2021)).eql(6);
    expect(numberOfWeeksInMonth(5, 2021)).eql(5);
    expect(numberOfWeeksInMonth(6, 2021)).eql(5);
    expect(numberOfWeeksInMonth(7, 2021)).eql(6);

    expect(numberOfWeeksInMonth(11, 2019)).eql(6);
  });
});
