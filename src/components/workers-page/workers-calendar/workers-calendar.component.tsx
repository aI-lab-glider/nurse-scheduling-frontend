import React from "react";
import { VerboseDate } from "../../../common-models/month-info.model";
import { ShiftCode } from "../../../common-models/shift-info.model";
import { WorkersCalendarCell } from "./worker-calendar-cell.component";
import { useScheduleStyling } from "../../common-components/use-schedule-styling/use-schedule-styling";

interface CalendarOptions {
  shiftsArr: [VerboseDate, ShiftCode][];
}

export default function WorkersCalendar({ shiftsArr }: CalendarOptions): JSX.Element {
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

  const data = useScheduleStyling(shiftsArr.map((x) => x[1]));

  return (
    <>
      <div className={"scheduleStyle"}>
        <div className={"calendarRow"}>
          {daysToDisplay.map((element) => {
            return <div className={"dayName"}>{element}</div>;
          })}
          {data?.map(({ cellData, keepOn, hasNext }, index) => {
            date = shiftsArr[index][0];
            if (date.date === 1) {
              notCurrentMonth = !notCurrentMonth;
            }

            return (
              <WorkersCalendarCell
                shift={cellData}
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
