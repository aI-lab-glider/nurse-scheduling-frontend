import { useSelector } from "react-redux";
import { StringHelper } from "../../../helpers/string.helper";
import { TranslationHelper } from "../../../helpers/tranlsations.helper";
import { ApplicationStateModel } from "../../../state/models/application-state.model";

export function useActualMonth(): string {
  /* eslint-disable @typescript-eslint/camelcase */
  const { month_number, year } = useSelector(
    (state: ApplicationStateModel) => state.scheduleData.present.schedule_info
  );

  let actualMonth = "";
  if (month_number && year) {
    actualMonth = StringHelper.capitalize(
      `${TranslationHelper.polishMonths[month_number]} ${year}`
    );
  }
  return actualMonth;
}
