import { StringHelper } from "../../helpers/string.helper";
import { DayOfWeek, WeekDays } from "../../state/models/schedule-data/month-info.model";

export interface VerboseDate {
  date:number,
  dayOfWeek: DayOfWeek,
  isFrozen?: boolean,
  month: string,
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
  private _verboseDates: VerboseDate[] = [] 
  private monthDates: number[];
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

  constructor(monthId: string | number, year: string, monthDates: number[], private daysFromPreviousMonthExists: boolean) {
    if (typeof monthId == "string") {
      // this.month = MonthLogic.monthTranslations[StringHelper.getRawValue(monthId)];
        monthId = Object.keys(MonthLogic.monthTranslations).findIndex((month) => StringHelper.getRawValue(month) == monthId);
    }
    this.month = Object.values(MonthLogic.monthTranslations)[monthId];
    if (!monthDates) {
      this.monthDates = this.generateMonthDates(this.month, year);
    } else {
      this.monthDates = monthDates;
    }

    this.monthNumber = monthId;
    
    this._verboseDates = this.createCalendar(this.month, year);
  }

  //#region logic
  private generateMonthDates(month: string, year: string): number[] {
    let dates:number[] = [];
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


  public static convertToDate(monthNumber: number, year) {
    return new Date(`1 ${Object.values(MonthLogic.monthTranslations)[monthNumber]} ${year}`);
  }

  private createCalendar(month: string, year: string): VerboseDate[] {
    let verboseDates: VerboseDate[] = [];
    // for (let day = 1; day < 31 && this.isDateBelongsToMonth(day, month, year); ++day) {
    for(let day of this.monthDates){
      if (day  === 1){
        this.daysFromPreviousMonthExists = false;
      }
      let date = new Date(`${day} ${month} ${year}`)
      verboseDates.push({
        date: day,
        dayOfWeek: WeekDays[date.getDay()],
        isFrozen: this.isDateFrozen(date),
        month: month
      })      
    }
    return verboseDates;
  }
  private isDateFrozen(date: Date) {
    let today = new Date();
    return ( (date.getDate() < today.getDate() 
              && date.getMonth() <= today.getMonth()) 
            || date.getFullYear() < today.getFullYear() 
            || this.daysFromPreviousMonthExists)
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
