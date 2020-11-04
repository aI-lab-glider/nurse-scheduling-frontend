// dates as represented here follow [day, month] pattern
// months as used here are human-readable i.e. go from 1 to 12 (hence + 1)

export class PublicHolidaysLogic {
  private publicHolidayDates: number[][];

  constructor(year: string) {
    this.publicHolidayDates = [
      // fixed holidays (święta stałe)
      [1, 1],
      [6, 1],
      [1, 5],
      [3, 5],
      [15, 8],
      [1, 11],
      [11, 11],
      [25, 12],
      [26, 12],
      // moveable holidays (święta ruchome)
      ...this.moveableHolidays(parseInt(year)),
    ];
  }

  public isPublicHoliday(day: number, month: number): boolean {
    return (
      this.publicHolidayDates.find((holiday) => holiday[0] === day && holiday[1] === month + 1) !==
      undefined
    );
  }

  private moveableHolidays(year: number): number[][] {
    function dateToDayMonth(date: Date): number[] {
      return [date.getDate(), date.getMonth() + 1];
    }

    // Easter
    const holidayDate = this.calculateEasterDate(year);
    let result = [dateToDayMonth(holidayDate)];

    // Easter Monday, 1 day after Easter (Poniedziałek Wielkanocny)
    holidayDate.setDate(holidayDate.getDate() + 1);
    result = [...result, dateToDayMonth(holidayDate)];

    // Green Week, 49 days after Easter (Zielone Świątki)
    holidayDate.setDate(holidayDate.getDate() + 48);
    result = [...result, dateToDayMonth(holidayDate)];

    // Feast of Corpus Christi, 60 days after Easter (Boże Ciało)
    holidayDate.setDate(holidayDate.getDate() + 11);
    result = [...result, dateToDayMonth(holidayDate)];

    return result;
  }

  // refer to https://pl.wikipedia.org/wiki/Wielkanoc#Metoda_Meeusa/Jonesa/Butchera
  private calculateEasterDate(year: number): Date {
    const a = year % 19,
      b = (year / 100) | 0,
      c = year % 100,
      h = (19 * a + b - ((b / 4) | 0) - (((b - (((b + 8) / 25) | 0) + 1) / 3) | 0) + 15) % 30,
      l = (32 + 2 * (b % 4) + 2 * ((c / 4) | 0) - h - (c % 4)) % 7,
      m = Math.floor((a + 11 * h + 22 * l) / 451);

    return new Date(
      year,
      Math.floor((h + l - 7 * m + 114) / 31) - 1,
      ((h + l - 7 * m + 114) % 31) + 1
    );
  }
}
