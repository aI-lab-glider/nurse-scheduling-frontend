import { VerboseDate, WeekDay } from "../../../../../../common-models/month-info.model";
import { TranslationHelper } from "../../../../../../helpers/translations.helper";

export interface UseCellBackgroundHighlightOptions {
  verboseDate?: VerboseDate;
  monthNumber?: number;
}

type HighlightId = "otherMonth" | "weekend" | "thisMonth";
export function useCellBackgroundHighlight({
  verboseDate,
  monthNumber,
}: UseCellBackgroundHighlightOptions): HighlightId {
  if (verboseDate && monthNumber) {
    if (verboseDate.month !== TranslationHelper.englishMonths[monthNumber]) {
      return "otherMonth";
    }
    if (
      verboseDate.isPublicHoliday ||
      verboseDate.dayOfWeek === WeekDay.SA ||
      verboseDate.dayOfWeek === WeekDay.SU
    ) {
      return "weekend";
    }
  }
  return "thisMonth";
}
