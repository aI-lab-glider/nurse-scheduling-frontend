/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import React from "react";
import styled from "styled-components";
import { colors } from "../../../../assets/colors";
import { useMonthInfo } from "../../../../hooks/use-month-info";
import { MonthInfoLogic } from "../../../../logic/schedule-logic/month-info.logic";
import { VerboseDate } from "../../../../state/schedule-data/foundation-info/foundation-info.model";
import { SectionRow, SectionWrapper } from "../../base/styled";
import { TimeTableCell } from "./timetable-cell.component";

export function TimeTableRow(): JSX.Element {
  let { verboseDates, monthNumber: currMont } = useMonthInfo();

  function createActualMonthData(): number[] {
    const today = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0);
    return Array.from({ length: today.getDate() }, (_, i) => i + 1);
  }

  function getVerboseDates(): [VerboseDate[], number] {
    if (verboseDates && verboseDates.length > 0) {
      return [verboseDates, currMont];
    }
    const today = new Date();

    const monthLogic = new MonthInfoLogic(
      today.getMonth(),
      today.getFullYear().toString(),
      createActualMonthData()
    );

    return [monthLogic.verboseDates, monthLogic.monthNumber];
  }

  [verboseDates, currMont] = getVerboseDates();

  return (
    <Wrapper>
      <TimetableRow data-cy="timetable-row">
        {verboseDates.map((verboseDate, cellIndex) => (
          <TimeTableCell
            key={`${verboseDate.date}_${cellIndex}`}
            value={verboseDate}
            currMonth={currMont}
            index={cellIndex}
          />
        ))}
      </TimetableRow>
    </Wrapper>
  );
}

const TimetableRow = styled(SectionRow)`
  width: 1350px;
  height: 70px;
  cursor: default;
`;

export const Wrapper = styled(SectionWrapper)`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0;

  background: ${colors.white};
  box-sizing: border-box;

  overflow: hidden;
  border: 1px solid ${colors.tableBorderGrey};
  border-radius: 10px;
`;
