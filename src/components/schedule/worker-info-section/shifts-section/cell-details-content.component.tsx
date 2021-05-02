/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import React from "react";
import { MdClose } from "react-icons/md";
import { useSelector } from "react-redux";
import { TranslationHelper } from "../../../../helpers/translations.helper";
import { ApplicationStateModel } from "../../../../state/application-state.model";
import styled from "styled-components";

export interface CellDetailsOptions {
  index: number;
  day: number;
  month: number;
  year: number;
  shiftcode: string;
  workerName?: string;
  close: () => void;
}

function prepareYearAndMonth(
  index: number,
  day: number,
  month: number,
  year: number
): [number, string] {
  let displayedYear = year;
  let monthName = `${TranslationHelper.polishMonthsGenetivus[month]}`;

  if (index < day - 1) {
    monthName = `${TranslationHelper.polishMonthsGenetivus[(month + 11) % 12]}`;
    displayedYear = month > 0 ? year : year - 1;
  } else if (index > 20 && day < 8) {
    monthName = `${TranslationHelper.polishMonthsGenetivus[(month + 1) % 12]}`;
    displayedYear = month < 11 ? year : year + 1;
  }
  return [displayedYear, monthName];
}

export function CellDetails(props: CellDetailsOptions): JSX.Element {
  const { index, day, month, year, shiftcode, close, workerName } = props;
  const [displayedYear, monthName] = prepareYearAndMonth(index, day, month, year);
  const shifts = useSelector(
    (state: ApplicationStateModel) => state.actualState.persistentSchedule.present.shift_types
  );
  const foundShift = shifts[shiftcode];

  return (
    <Wrapper>
      <ExitButton onClick={close}>
        <MdClose />
      </ExitButton>
      <Date>
        {day} {monthName} {displayedYear} r.
      </Date>
      {workerName && <div>{workerName}</div>}
      <Content>
        {/* // TODO: change div to different html tags e.g. spans, introduce css variables */}
        <ShiftColorBox style={{ backgroundColor: `#${foundShift.color}` }} />
        <ShiftBoxName style={{ backgroundColor: `#${foundShift.color}` }}>
          {foundShift.name}
        </ShiftBoxName>
        <ShiftName>{foundShift.name}</ShiftName>
        <ShiftDuration className="shift-time-from-to">
          {foundShift.isWorkingShift ? `${foundShift.from}:00 - ${foundShift.to}:00` : ""}
        </ShiftDuration>
      </Content>
    </Wrapper>
  );
}

const Wrapper = styled.div`
  text-align: left;
  line-height: normal;
`;
const ExitButton = styled.div`
  cursor: pointer;
  width: 40px;
  height: 40px;
  position: absolute;
  top: 0;
  right: 0;
  padding-top: 5px;
  padding-left: 20px;
  padding-right: 5px;
`;

const Date = styled.div`
  font-weight: lighter;
  padding-right: 20px;
`;

const Content = styled.div`
  width: 100%;
  margin: auto;
  height: 40px;
  align-content: stretch;
  padding-top: 10px;
  display: flex;
`;

const ShiftBoxName = styled.div`
  color: white;
  opacity: 0.3;
  padding: 7px;
  padding-right: 13px;
  height: 100%;
  display: inline-block;
`;

const ShiftName = styled.div`
  color: black;
  opacity: 1;
  display: inline;
  position: absolute;
  top: 57px;
  left: 22px;
`;

const ShiftColorBox = styled.div`
  opacity: 1;
  width: 5px;
  height: 100%;
  border-radius: 5px;
  display: inline-block;
`;

const ShiftDuration = styled.div`
  padding-top: 7px;
  padding-right: 20px;
  position: relative;
  left: 15px;
  vertical-align: middle;
  font-weight: lighter;
`;
