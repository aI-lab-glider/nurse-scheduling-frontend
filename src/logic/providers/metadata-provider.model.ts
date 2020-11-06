import { VerboseDate } from "../../common-models/month-info.model";
import { MonthInfoLogic } from "../schedule-logic/month-info.logic";

export abstract class MetadataProvider {
  abstract get monthNumber(): number;
  abstract get year(): number;
  abstract get daysFromPreviousMonthExists(): boolean;
  abstract get frozenDates(): [number | string, number][];
  abstract get dates(): number[];
  abstract get monthLogic(): MonthInfoLogic;
  get verboseDates(): VerboseDate[] {
    return [];
  }
  changeShiftFrozenState(rowind: number, shiftIndex: number): [number, number][] {
    return [];
  }
}
