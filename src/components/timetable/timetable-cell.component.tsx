/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import React from "react";
import { VerboseDate, WeekDay } from "../../common-models/month-info.model";
import { TranslationHelper } from "../../helpers/translations.helper";

export interface TimeTableCellOptions {
  value: VerboseDate;
  currMonth: number;
}

function TimeTableCellF({ value, currMonth }: TimeTableCellOptions): JSX.Element {
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

  return (
    <td className="timetableCell" id={getId()}>
      <span>{TranslationHelper.weekDaysTranslations[value.dayOfWeek]}</span>
      <span className={circle}>
        <span className={today}>{value.date}</span>
      </span>
    </td>
  );
}

export const TimeTableCell: React.FC<TimeTableCellOptions> = React.memo(
  TimeTableCellF,
  (prev, next) => {
    return prev.value === next.value;
  }
);
