import React from "react";
import { ShiftCode, shifts } from "../../../common-models/shift-info.model";
import { WorkerInfoModel } from "../../../common-models/worker-info.model";
import { VerboseDate } from "../../../common-models/month-info.model";

const calendarShifts = shifts;
calendarShifts["W"]["name"] = " ";
calendarShifts["U"]["name"] = "Urlop";
calendarShifts["DN"]["name"] = "D+N";
calendarShifts["PN"]["name"] = "P+N";
calendarShifts["L4"]["name"] = "L4";

interface CalendarOptions {
  params: WorkerInfoModel;
}

interface CellOptions {
  keepOn: boolean;
  date: VerboseDate | null;
  shift: ShiftCode | null;
  hasNext: boolean;
  notCurrentMonth: boolean;
}

export default function WorkersCalendar(params: CalendarOptions): JSX.Element {
  const shiftsArr = params.params.shifts;
  const firstDay = shiftsArr![0]![0]!["dayOfWeek"];
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
            if (date!["date"] === 1) {
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

function WorkersCalendarCell(params: CellOptions): JSX.Element {
  const date = params.date;
  const shift = params.shift;
  const keepOn = "keepOn" + params.keepOn;
  const hasNext = "hasNext" + params.hasNext;
  const notCurrentMonth = "notCurrentMonth" + params.notCurrentMonth;

  return (
    <>
      <div className={"workersCalendarCell"}>
        <div className={"TopCellPart " + notCurrentMonth}>{date!["date"]}</div>
        <div className={"BottomCellPart " + keepOn + shift + " " + hasNext}>
          <div className={"leftBorder leftBorderColor"} />
          <p>{params.keepOn ? void 0 : calendarShifts[shift!]["name"]}</p>
        </div>
      </div>
    </>
  );
}
