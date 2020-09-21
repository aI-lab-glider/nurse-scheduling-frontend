import { ArrayHelper } from "../../helpers/array.helper";
import { StringHelper } from "../../helpers/string.helper";
import { DayOfWeek, WeekDays } from "../../state/models/schedule-data/month-info.model";

export interface DateType {
  date:number,
  dayOfWeek: DayOfWeek
}

export class MonthLogic {
  //#region transltaions
  private static monthTranslations = {
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
  private _dateTypes: DateType[] = [] 
  //#endregion

  constructor(monthId: string | number, year: string) {
    if (typeof monthId == "string") {
      this.month = MonthLogic.monthTranslations[StringHelper.getRawValue(monthId)];
    } else {
      this.month = Object.values(MonthLogic.monthTranslations)[monthId];
    }
    this.monthNumber = Object.values(MonthLogic.monthTranslations).findIndex(
      (m) => m === this.month
    );
    [this.daysOfWeek, this.dates, this.dayCount] = this.createFullWeekCalendar(this.month, year);
    this._dateTypes = this.desribeDates(this.dates, this.daysOfWeek)
  }

  //#region logic
  public get dateTypes(): DateType[] {
    return this._dateTypes;
  } 

  private desribeDates(dates: number[], weekDays: DayOfWeek[]): DateType[] {
    return ArrayHelper.zip(dates, weekDays).map(([date, weekDay]) => {
      return {
        date: date,
        dayOfWeek: weekDay 
      }
    })
  }

  public static convertToDate(monthNumber: number, year) {
    return new Date(`1 ${Object.values(MonthLogic.monthTranslations)[monthNumber]} ${year}`);
  }


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
      days_of_week.slice(firstMondayIndex, lastSundayIndex + 1),
      dates.slice(firstMondayIndex, lastSundayIndex + 1),
    ];
  }

  private isdDateBelongsToMonth(date: number, month: string, year: string) {
    return (
      Object.values(MonthLogic.monthTranslations)[
        new Date(`${date} ${month} ${year}`).getMonth()
      ] === month
    );
  }
  
  //#endregion
}
