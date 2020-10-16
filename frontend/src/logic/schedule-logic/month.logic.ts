import { StringHelper } from "../../helpers/string.helper";
import { WeekDay } from "../../state/models/schedule-data/month-info.model";

export interface VerboseDate {
  date: number;
  dayOfWeek: WeekDay;
  isFrozen?: boolean;
  month: string;
}

export class MonthLogic {
  //#region transltaions
  public static monthTranslations = {
    styczeń: "january",
    luty: "february",
    marzec: "march",
    kwiecień: "april",
    maj: "may",
    czerwiec: "june",
    lipiec: "july",
    sierpień: "august",
    wrzesień: "september",
    październik: "october",
    listopad: "november",
    grudzień: "december",
  };
  //#endregion

  //#region members
  public monthNumber: number;
  private _verboseDates: VerboseDate[] = [];
  private monthDates: number[];
  //#endregion

  public get dates() {
    return this._verboseDates.map((d) => d.date);
  }

  public get dayCount() {
    return this._verboseDates.length;
  }

  public get daysOfWeek() {
    return this._verboseDates.map((d) => d.dayOfWeek);
  }

  constructor(
    monthId: string | number,
    year: string,
    monthDates: number[],
    daysFromPreviousMonthExists: boolean
  ) {
    if (typeof monthId == "string") {
      // this.month = MonthLogic.monthTranslations[StringHelper.getRawValue(monthId)];
      monthId = Object.keys(MonthLogic.monthTranslations).findIndex(
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

  //#region logic
  private generateMonthDates(monthNumber: number, year: string): number[] {
    let dates: number[] = [];
    const month = Object.values(MonthLogic.monthTranslations)[monthNumber];
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
    const month = Object.values(MonthLogic.monthTranslations)[this.monthNumber];
    return this._verboseDates.filter(
      (date) => date.month === month && MonthLogic.isWorkingDay(date.dayOfWeek)
    ).length;
  }

  public get numberOfPreviousMonthDays(): number {
    const month = Object.values(MonthLogic.monthTranslations)[this.monthNumber];
    return this._verboseDates.filter((date) => date.month !== month).length;
  }

  public static convertToDate(monthNumber: number, year) {
    return new Date(`1 ${Object.values(MonthLogic.monthTranslations)[monthNumber]} ${year}`);
  }

  private createCalendar(
    monthNumber: number,
    year: string,
    daysFromPreviousMonthExists: boolean
  ): VerboseDate[] {
    let verboseDates: VerboseDate[] = [];
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
    for (let day of this.monthDates) {
      if (day === 1) {
        daysFromPreviousMonthExists = false;
      }
      const month = Object.values(MonthLogic.monthTranslations)[
        daysFromPreviousMonthExists ? monthNumber - 1 : monthNumber
      ];
      let date = new Date(`${day} ${month} ${year}`);
      verboseDates.push({
        date: day,
        dayOfWeek: weekDays[date.getDay()],
        isFrozen: false,
        // this.isDateFrozen(date, daysFromPreviousMonthExists),
        month: month,
      });
    }
    return verboseDates;
  }
  private isDateFrozen(date: Date, dayBelongToPreviousMonth: boolean) {
    let today = new Date();
    return (
      (date.getDate() < today.getDate() && date.getMonth() <= today.getMonth()) ||
      date.getFullYear() < today.getFullYear() ||
      dayBelongToPreviousMonth
    );
  }

  private isDateBelongsToMonth(date: number, month: string, year: string) {
    return (
      Object.values(MonthLogic.monthTranslations)[
        new Date(`${date} ${month} ${year}`).getMonth()
      ] === month
    );
  }

  //#endregion
}
