import { StringHelper } from "../../helpers/string.helper";
import { TranslationHelper } from "../../helpers/tranlsations.helper";
import { WeekDay } from "../../state/models/schedule-data/month-info.model";

export interface VerboseDate {
  date: number;
  dayOfWeek: WeekDay;
  isFrozen?: boolean;
  month: string;
}

export class MonthLogic {
  public monthNumber: number;
  private _verboseDates: VerboseDate[] = [];
  private monthDates: number[];

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
      monthId = Object.keys(TranslationHelper.monthTranslations).findIndex(
        (month) => StringHelper.getRawValue(month) === monthId
      );
    }
    if (!monthDates) {
      this.monthDates = this.generateMonthDates(monthId, year);
    } else {
      this.monthDates = monthDates;
    }

    this.monthNumber = monthId;

    this._verboseDates = this.createCalendar(this.monthNumber, year, daysFromPreviousMonthExists);
  }

  private generateMonthDates(monthNumber: number, year: string): number[] {
    const dates: number[] = [];
    const month = Object.values(TranslationHelper.monthTranslations)[monthNumber];
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
    const month = Object.values(TranslationHelper.monthTranslations)[this.monthNumber];
    return this._verboseDates.filter(
      (date) => date.month === month && MonthLogic.isWorkingDay(date.dayOfWeek)
    ).length;
  }

  public get numberOfPreviousMonthDays(): number {
    const month = Object.values(TranslationHelper.monthTranslations)[this.monthNumber];
    return this._verboseDates.filter((date) => date.month !== month).length;
  }

  public static convertToDate(monthNumber: number, year): Date {
    return new Date(`1 ${Object.values(TranslationHelper.monthTranslations)[monthNumber]} ${year}`);
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
      const month = Object.values(TranslationHelper.monthTranslations)[
        daysFromPreviousMonthExists ? monthNumber - 1 : monthNumber
      ];
      const date = new Date(`${day} ${month} ${year}`);
      verboseDates.push({
        date: day,
        dayOfWeek: weekDays[date.getDay()],
        isFrozen: false,
        // TODO: handle automatic frozen state
        // this.isDateFrozen(date, daysFromPreviousMonthExists),
        month: month,
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
      Object.values(TranslationHelper.monthTranslations)[
        new Date(`${date} ${month} ${year}`).getMonth()
      ] === month
    );
  }
}
