/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import _ from "lodash";
import React from "react";
import styled from "styled-components";
import { colors } from "../../assets/colors";
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
    <Wrapper id={id}>
      <CalendarWrapper>
        {daysToDisplay.map((element) => (
          <DayName>{element}</DayName>
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
      </CalendarWrapper>
    </Wrapper>
  );
}

const Wrapper = styled.div`
  width: 100%;
`;
const CalendarWrapper = styled.div`
  width: 100%;
  display: flex;
  flex-flow: row wrap;
  align-content: space-between;
  justify-content: space-between;
  border-left: 1px solid ${colors.tableBorderGrey};
  border-top: 1px solid ${colors.tableBorderGrey};
`;

const DayName = styled.div`
  size: 14px;
  letter-spacing: 0.75px;
  font-weight: 400;
  width: 14.2%;
  height: 30px;
  padding: 5px;
  margin: auto;
  display: flex;
  justify-content: center;
  border-bottom: 1px solid ${colors.tableBorderGrey};
  border-right: 1px solid ${colors.tableBorderGrey};
`;
