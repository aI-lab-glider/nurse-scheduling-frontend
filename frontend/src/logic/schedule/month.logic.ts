import { StringHelper } from "../../helpers/string.helper";
import { DayOfWeek, WeekDays } from "../../state/models/schedule-data/month-info.model";

export class MonthLogic {
  //#region transltaions
  private monthTranslations = {
    styczeń: "january",
    luty: "february",
    marzec: "march",
    kwiecień: "april",
    marc: "may",
    czerwiec: "june",
    lipiec: "july",
    sierpień: "august",
    wrzesień: "september",
    pażdziernik: "october",
    listopad: "november",
    grudzień: "december",
  };
  //#endregion

  //#region members
  private month: string;
  public monthNumber: number;
  public dates: number[] = [];
  public dayCount: number = 0;
  public daysOfWeek: DayOfWeek[] = [];

  //#endregion

  constructor(nameInPolish: string, year: string) {
    this.month = this.monthTranslations[StringHelper.getRawValue(nameInPolish)];
    this.monthNumber = Object.values(this.monthTranslations).findIndex((m) => m === this.month);
    [this.daysOfWeek, this.dates, this.dayCount] = this.createFullWeekCalendar(this.month, year);
  }

  //#region logic
  private createFullWeekCalendar(month: string, year: string): [DayOfWeek[], number[], number] {
    let [daysOfWeek, dates, _] = this.createCalendar(month, year);
    [daysOfWeek, dates] = this.trimToFullWeeks(daysOfWeek, dates);
    return [daysOfWeek, dates, dates.length];
  }

  private createCalendar(month: string, year: string): [DayOfWeek[], number[], number] {
    let daysOfWeek: DayOfWeek[] = [];
    let dates: number[] = [];
    for (let date = 1; date < 31 && this.isdDateBelongsToMonth(date, month, year); ++date) {
      let day_of_week = new Date(`${date} ${month} ${year}`).getDay();
      daysOfWeek.push(WeekDays[day_of_week]);
      dates.push(date);
    }
    return [daysOfWeek, dates, dates.length];
  }

  private trimToFullWeeks(days_of_week: DayOfWeek[], dates: number[]): [DayOfWeek[], number[]] {
    let firstMondayIndex = days_of_week.indexOf("MO");
    let lastSundayIndex = days_of_week.lastIndexOf("SU");
    return [
      days_of_week.slice(firstMondayIndex, lastSundayIndex),
      dates.slice(firstMondayIndex, lastSundayIndex),
    ];
  }

  private isdDateBelongsToMonth(date: number, month: string, year: string) {
    return (
      Object.values(this.monthTranslations)[new Date(`${date} ${month} ${year}`).getMonth()] ===
      month
    );
  }
  //#endregion
}
