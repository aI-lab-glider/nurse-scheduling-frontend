/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */

import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { VerboseDate } from "../state/schedule-data/foundation-info/foundation-info.model";
import { MonthInfoLogic } from "../logic/schedule-logic/month-info.logic";
import { ApplicationStateModel } from "../state/application-state.model";

interface UseMonthInfoReturn {
  verboseDates: VerboseDate[];
  monthNumber: number;
  year: number;
}

export function useMonthInfo(): UseMonthInfoReturn {
  const { dates } = useSelector(
    (state: ApplicationStateModel) => state.actualState.persistentSchedule.present.month_info
  );
  const { year, month_number } = useSelector(
    (state: ApplicationStateModel) => state.actualState.persistentSchedule.present.schedule_info
  );

  const { verboseDates } = new MonthInfoLogic(month_number, year, dates);
  const [useMonthState, setUseMonthState] = useState<UseMonthInfoReturn>({
    verboseDates,
    year,
    monthNumber: month_number,
  });

  useEffect(() => {
    const { verboseDates } = new MonthInfoLogic(month_number, year, dates);
    setUseMonthState({
      verboseDates,
      year,
      monthNumber: month_number,
    });
  }, [dates, year, month_number]);

  return useMonthState;
}
