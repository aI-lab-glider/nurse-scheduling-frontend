/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import _ from "lodash";
import React from "react";
import * as S from "./workers-calendar.styled";
import { useMonthInfo } from "../../hooks/use-month-info";
import { applyScheduleStyling } from "../../hooks/use-schedule-styling/use-schedule-styling";
import { VerboseDate } from "../../state/schedule-data/foundation-info/foundation-info.model";
import { ShiftCode } from "../../state/schedule-data/shifts-types/shift-types.model";
import { WorkersCalendarCell } from "./worker-calendar-cell.component";

interface CalendarOptions {
  id: string;
  workerShifts: ShiftCode[];
}
// TODO: Shrink drawer

export default function WorkersCalendar({ id, workerShifts }: CalendarOptions): JSX.Element {
  const { verboseDates } = useMonthInfo();
  const shiftsArr = _.zip(verboseDates, workerShifts);
  const firstDay = shiftsArr[0][0].dayOfWeek;
  const dayOfWeekNamesEng = ["MO", "TU", "WE", "TH", "FR", "SA", "SU"];
  const dayOfWeekNames = ["PON", "WT", "ŚR", "CZW", "PT", "SB", "ND"];
  const daysToDisplay: string[] = [];
  let date: VerboseDate;
  let notCurrentMonth = true;
  for (let i = dayOfWeekNamesEng.indexOf(firstDay); i < 7; i++) {
    daysToDisplay.push(dayOfWeekNames[i]);
  }
  for (let i = 0; i < dayOfWeekNamesEng.indexOf(firstDay); i++) {
    daysToDisplay.push(dayOfWeekNames[i]);
  }

  const data = applyScheduleStyling(shiftsArr.map((x) => x[1]));

  let isTop = false;
  let isLeft = false;

  return (
    <S.Wrapper id={id}>
      <S.CalendarWrapper>
        {daysToDisplay.map((element) => (
          <S.DayName>{element}</S.DayName>
        ))}
        {data?.map(({ value: shiftCode, keepOn, hasNext }, index) => {
          date = shiftsArr[index][0];
          if (date.date === 1) {
            notCurrentMonth = !notCurrentMonth;
          }
          if (shiftCode === "W") {
            shiftCode = "" as ShiftCode;
          }

          isTop = index < 7;
          isLeft = index % 7 === 0;

          return (
            <WorkersCalendarCell
              key={`${date.date}_${shiftCode}`}
              shift={shiftCode}
              date={date}
              keepOn={keepOn}
              workersCalendar
              hasNext={hasNext}
              notCurrentMonth={notCurrentMonth}
              isTop={isTop}
              isLeft={isLeft}
            />
          );
        })}
      </S.CalendarWrapper>
    </S.Wrapper>
  );
}
