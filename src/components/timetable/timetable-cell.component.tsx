/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import React, { useCallback } from "react";
import { VerboseDate, WeekDay } from "../../common-models/month-info.model";
import {
  AlgorithmErrorCode,
  GroupedScheduleErrors,
  ScheduleError,
} from "../../common-models/schedule-error.model";
import { TranslationHelper } from "../../helpers/translations.helper";
import { ErrorTooltipProvider } from "../schedule-page/table/schedule/schedule-parts/error-tooltip.component";

export interface TimeTableCellOptions {
  value: VerboseDate;
  currMonth: number;
  index: number;
}

function TimeTableCellF({ value, currMonth, index }: TimeTableCellOptions): JSX.Element {
  function getId(): string {
    if (value.month !== TranslationHelper.englishMonths[currMonth]) {
      return "otherMonthHeader";
    }
    if (value.isPublicHoliday || value.dayOfWeek === WeekDay.SA || value.dayOfWeek === WeekDay.SU) {
      return "weekendHeader";
    }
    return "thisMonthHeader";
  }

  function isToday(): [string, string] {
    const today = new Date();
    if (
      value.month === TranslationHelper.englishMonths[today.getMonth()] &&
      value.date === today.getDate()
    ) {
      return ["today", "circle"];
    }
    return ["bolded", "noCircle"];
  }

  const [today, circle] = isToday();

  const errorSelector = useCallback(
    (scheduleErros: GroupedScheduleErrors): ScheduleError[] => {
      const matchingErrorsByType = [
        ...(scheduleErros[AlgorithmErrorCode.WorkerNumberDuringDay] ?? []),
        ...(scheduleErros[AlgorithmErrorCode.WorkerNumberDuringNight] ?? []),
      ];
      return matchingErrorsByType.filter((error) => {
        return (
          (error.kind === AlgorithmErrorCode.WorkerNumberDuringNight ||
            error.kind === AlgorithmErrorCode.WorkerNumberDuringDay) &&
          error.day === value.date
        );
      });
    },
    [value.date]
  );

  return (
    <td className="timetableCell" id={getId()}>
      <ErrorTooltipProvider
        className="timetableCell wrapper"
        errorSelector={errorSelector}
        errorTriangleOffset={{
          top: 8,
          right: -5,
        }}
        errorTooltipOffset={{
          left: 20,
          top: 8,
        }}
      >
        <span>{TranslationHelper.weekDaysTranslations[value.dayOfWeek]}</span>
        <span className={circle}>
          <span className={today}>{value.date}</span>
        </span>
      </ErrorTooltipProvider>
    </td>
  );
}

export const TimeTableCell: React.FC<TimeTableCellOptions> = React.memo(
  TimeTableCellF,
  (prev, next) => {
    return prev.value === next.value;
  }
);
