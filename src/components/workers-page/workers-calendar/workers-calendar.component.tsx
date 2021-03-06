/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import React from "react";
import { VerboseDate } from "../../../common-models/month-info.model";
import { ShiftCode } from "../../../common-models/shift-info.model";
import { WorkersCalendarCell } from "./worker-calendar-cell.component";
import { applyScheduleStyling } from "../../common-components/use-schedule-styling/use-schedule-styling";

interface CalendarOptions {
  shiftsArr: [VerboseDate, ShiftCode][];
}

export class WorkersCalendar extends React.Component<CalendarOptions> {
  render(): JSX.Element {
    const shiftsArr = this.props.shiftsArr;
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
      <div>
        <div className={"scheduleStyle"}>
          <div className={"calendarRow"}>
            {daysToDisplay.map((element) => {
              return <div className={"dayName"}>{element}</div>;
            })}
            {data?.map(({ value, keepOn, hasNext }, index) => {
              date = shiftsArr[index][0];
              if (date.date === 1) {
                notCurrentMonth = !notCurrentMonth;
              }
              if (value === "W") {
                value = "" as ShiftCode;
              }

              isTop = index < 7;
              isLeft = index % 7 === 0;

              return (
                <WorkersCalendarCell
                  shift={value}
                  date={date}
                  keepOn={keepOn}
                  workersCalendar={true}
                  hasNext={hasNext}
                  notCurrentMonth={notCurrentMonth}
                  isTop={isTop}
                  isLeft={isLeft}
                />
              );
            })}
          </div>
        </div>
      </div>
    );
  }
}
