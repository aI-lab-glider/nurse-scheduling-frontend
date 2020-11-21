import { StringHelper } from "../../helpers/string.helper";
import { TranslationHelper } from "../../helpers/tranlsations.helper";
import { VerboseDate, WeekDay } from "../../common-models/month-info.model";
import { PublicHolidaysLogic } from "./public-holidays.logic";

export class MonthInfoLogic {
  public monthNumber: number;
  private _verboseDates: VerboseDate[] = [];
  private monthDates: number[];
  private publicHolidaysLogic: PublicHolidaysLogic;

  public get dates(): number[] {
    return this._verboseDates.map((d) => d.date);
  }

  public get dayCount(): number {
    return this._verboseDates.length;
  }

  public get daysOfWeek(): WeekDay[] {
    return this._verboseDates.map((d) => d.dayOfWeek);
  }

  constructor(
    monthId: string | number,
    public year: string,
    monthDates: number[],
    daysFromPreviousMonthExists: boolean
  ) {
    if (typeof monthId == "string") {
      monthId = TranslationHelper.polishMonths.findIndex(
        (month) => StringHelper.getRawValue(month) === monthId
      );
    }
    if (!monthDates) {
      this.monthDates = this.generateMonthDates(monthId, year);
    } else {
      this.monthDates = monthDates;
    }

    this.monthNumber = monthId;

    this.publicHolidaysLogic = new PublicHolidaysLogic(year);

    this._verboseDates = this.createCalendar(this.monthNumber, year, daysFromPreviousMonthExists);
  }

  private generateMonthDates(monthNumber: number, year: string): number[] {
    const dates: number[] = [];
    const month = TranslationHelper.englishMonths[monthNumber];
    let day = 1;
    while (this.isDateBelongsToMonth(day, month, year)) {
      dates.push(day);
      ++day;
    }
    return dates;
  }

  public get verboseDates(): VerboseDate[] {
    return this._verboseDates;
  }

  // TODO add holidays
  private static isWorkingDay(day: WeekDay): boolean {
    return day !== WeekDay.SA && day !== WeekDay.SU;
  }

  public get workingDaysNumber(): number {
    const month = TranslationHelper.englishMonths[this.monthNumber];
    return this._verboseDates.filter(
      (date) => date.month === month && MonthInfoLogic.isWorkingDay(date.dayOfWeek)
    ).length;
  }

  public get numberOfPreviousMonthDays(): number {
    const month = TranslationHelper.englishMonths[this.monthNumber];
    return this._verboseDates.filter((date) => date.month !== month).length;
  }

  public static convertToDate(monthNumber: number, year): Date {
    return new Date(`1 ${TranslationHelper.englishMonths[monthNumber]} ${year}`);
  }

  private createCalendar(
    monthNumber: number,
    year: string,
    daysFromPreviousMonthExists: boolean
  ): VerboseDate[] {
    const verboseDates: VerboseDate[] = [];
    // declare array by hand instead of using Object.values(WeekDay), to be sure
    // that order of day will always be consistent with js-function Date.getDay()
    const weekDays = [
      WeekDay.SU,
      WeekDay.MO,
      WeekDay.TU,
      WeekDay.WE,
      WeekDay.TH,
      WeekDay.FR,
      WeekDay.SA,
    ];
    for (const day of this.monthDates) {
      if (day === 1) {
        daysFromPreviousMonthExists = false;
      }
      const month = daysFromPreviousMonthExists ? monthNumber - 1 : monthNumber;
      const isPublicHoliday = this.publicHolidaysLogic.isPublicHoliday(day, month);
      const monthName = TranslationHelper.englishMonths[month];
      const date = new Date(`${day} ${monthName} ${year}`);
      verboseDates.push({
        date: day,
        dayOfWeek: weekDays[date.getDay()],
        isPublicHoliday: isPublicHoliday,
        isFrozen: false,
        // TODO: handle automatic frozen state
        // this.isDateFrozen(date, daysFromPreviousMonthExists),
        month: monthName,
      });
    }
    return verboseDates;
  }
  private isDateFrozen(date: Date, dayBelongToPreviousMonth: boolean): boolean {
    const today = new Date();
    return (
      (date.getDate() < today.getDate() && date.getMonth() <= today.getMonth()) ||
      date.getFullYear() < today.getFullYear() ||
      dayBelongToPreviousMonth
    );
  }

  private isDateBelongsToMonth(date: number, month: string, year: string): boolean {
    return (
      TranslationHelper.englishMonths[new Date(`${date} ${month} ${year}`).getMonth()] === month
    );
  }
}
