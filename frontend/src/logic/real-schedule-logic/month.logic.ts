import { ArrayHelper } from "../../helpers/array.helper";
import { StringHelper } from "../../helpers/string.helper";
import { DayOfWeek, WeekDays } from "../../state/models/schedule-data/month-info.model";

export interface VerboseDate {
  date:number,
  dayOfWeek: DayOfWeek,
  isFrozen?: boolean,
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
  public _dates: number[] = [];
  public _dayCount: number = 0;
  public _daysOfWeek: DayOfWeek[] = [];
  private _verboseDates: VerboseDate[] = [] 
  //#endregion

  public get dates() {
    return this._verboseDates.map(d => d.date);
  }

  public get dayCount() {
    return this._verboseDates.length;
  }

  public get daysOfWeek() {
    return this._verboseDates.map(d => d.dayOfWeek);
  }

  constructor(monthId: string | number, year: string) {
    if (typeof monthId == "string") {
      this.month = MonthLogic.monthTranslations[StringHelper.getRawValue(monthId)];
    } else {
      this.month = Object.values(MonthLogic.monthTranslations)[monthId];
    }
    this.monthNumber = Object.values(MonthLogic.monthTranslations).findIndex(
      (m) => m === this.month
    );
    this._verboseDates = this.createFullWeekCalendar(this.month, year);
    // this._dateTypes = this.toVerboseDates(this.dates, this.daysOfWeek)
  }

  //#region logic
  public get verboseDates(): VerboseDate[] {
    return this._verboseDates;
  } 

  private toVerboseDates(dates: number[], weekDays: DayOfWeek[]): VerboseDate[] {
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


  private createFullWeekCalendar(month: string, year: string): VerboseDate[] {
    let [daysOfWeek, dates, _] = this.createCalendar(month, year);
    
    let verboseDates = this.toVerboseDates(dates, daysOfWeek);
    verboseDates = this.trimToFullWeeks(verboseDates);
    
    return verboseDates
    // [daysOfWeek, dates] = this.trimToFullWeeks(daysOfWeek, dates);
    // [daysOfWeek, dates, dates.length];
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

  private trimToFullWeeks(verboseDates: VerboseDate[]): VerboseDate[] {
    let firstMondayIndex = verboseDates.findIndex(d => d.dayOfWeek === "MO");
    let lastSundayIndex = verboseDates.length - [...verboseDates].reverse().findIndex(d => d.dayOfWeek === "SU");
    return verboseDates.map((item, index) => {
      return {
        ...item,
        isFrozen: index < firstMondayIndex || index > lastSundayIndex 
      }
    })    
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
