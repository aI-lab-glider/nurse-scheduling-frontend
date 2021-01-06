/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import React from "react";
import { VerboseDate } from "../../../common-models/month-info.model";
import { ShiftCode } from "../../../common-models/shift-info.model";
import { WorkersCalendarCell } from "./worker-calendar-cell.component";

interface CalendarOptions {
  shiftsArr: [VerboseDate, ShiftCode][];
}

export default function WorkersCalendar({ shiftsArr }: CalendarOptions): JSX.Element {
  const firstDay = shiftsArr[0][0].dayOfWeek;
  const dayOfWeekNamesEng = ["MO", "TU", "WE", "TH", "FR", "SA", "SU"];
  const dayOfWeekNames = ["PON", "WT", "ŚR", "CZW", "PT", "SB", "ND"];
  const daysToDisplay: string[] = [];
  let prevShift: ShiftCode | null = null;
  let nextShift: ShiftCode | null = null;
  let keepOn: boolean;
  let hasNext: boolean;
  let notCurrentMonth = true;
  for (let i = dayOfWeekNamesEng.indexOf(firstDay); i < 7; i++) {
    daysToDisplay.push(dayOfWeekNames[i]);
  }
  for (let i = 0; i < dayOfWeekNamesEng.indexOf(firstDay); i++) {
    daysToDisplay.push(dayOfWeekNames[i]);
  }
  return (
    <>
      <div id={"workersCalendar"}>
        <div className={"calendarRow"}>
          {daysToDisplay.map((element) => {
            return <div className={"dayName"}>{element}</div>;
          })}
          {shiftsArr?.map((element, index) => {
            const [date, shift] = element;
            if (index < shiftsArr.length - 1) {
              nextShift = shiftsArr[index + 1][1];
            } else {
              nextShift = null;
            }
            if (date.date === 1) {
              notCurrentMonth = !notCurrentMonth;
            }
            keepOn =
              prevShift === shift && [ShiftCode.K, ShiftCode.U, ShiftCode.L4, null].includes(shift);
            hasNext =
              nextShift === shift && [ShiftCode.K, ShiftCode.U, ShiftCode.L4, null].includes(shift);
            prevShift = shift;
            return (
              <WorkersCalendarCell
                shift={shift}
                date={date}
                keepOn={keepOn}
                hasNext={hasNext}
                notCurrentMonth={notCurrentMonth}
              />
            );
          })}
        </div>
      </div>
    </>
  );
}
