import { useSelector } from "react-redux";
import { StringHelper } from "../../../helpers/string.helper";
import { ApplicationStateModel } from "../../../state/models/application-state.model";
import { TranslationHelper } from "../../../helpers/translations.helper";
import { useEffect, useState } from "react";

export function useActualMonth(): string {
  /* eslint-disable @typescript-eslint/camelcase */
  const { month_number, year } = useSelector(
    (state: ApplicationStateModel) => state.actualState.temporarySchedule.present.schedule_info
  );
  const [actualMonth, setActualMonth] = useState<string>("");
  useEffect(() => {
    if (month_number && year) {
      const month = StringHelper.capitalize(
        `${TranslationHelper.polishMonths[month_number]} ${year}`
      );
      setActualMonth(month);
    }
  }, [month_number, year]);

  // let actualMonth = "";
  return actualMonth;
}
