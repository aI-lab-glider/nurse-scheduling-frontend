/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import { fade } from "@material-ui/core";
import React from "react";
import { useSelector } from "react-redux";
import styled from "styled-components";
import { colors } from "../../assets/colors";
import { VerboseDate } from "../../state/schedule-data/foundation-info/foundation-info.model";
import { getPresentShiftTypes } from "../../state/schedule-data/selectors";
import { ShiftCode } from "../../state/schedule-data/shifts-types/shift-types.model";
import { DEFAULT_SHIFT_HEX } from "../schedule/worker-info-section/shifts-section/shift-cell/shift-cell.component";

interface CellOptions {
  keepOn: boolean;
  date: VerboseDate;
  shift: ShiftCode;
  hasNext: boolean;
  notCurrentMonth: boolean;
  workersCalendar: boolean;
  isTop?: boolean;
  isLeft?: boolean;
}

export function WorkersCalendarCell(params: CellOptions): JSX.Element {
  const { date, shift: shiftCode } = params;
  const notCurrentMonth = `notCurrentMonth${params.notCurrentMonth}`;
  let shiftColor: string;
  let background: string;

  const shiftTypes = useSelector(getPresentShiftTypes);

  if (shiftCode) {
    shiftColor = `#${shiftTypes[shiftCode].color ?? DEFAULT_SHIFT_HEX}`;
    background = fade(shiftColor, 0.3);
  } else {
    shiftColor = fade("#FFFFFF", 0);
    background = fade(shiftColor, 0);
  }
  return (
    <ShiftCell>
      <ShiftTop className={notCurrentMonth}>{date!.date}</ShiftTop>
      <ShiftBottom style={{ color: shiftColor, backgroundColor: background }}>
        <ShiftBar style={{ backgroundColor: shiftColor }} />
        <ShiftSymbol>{params.keepOn ? void 0 : shiftCode}</ShiftSymbol>
      </ShiftBottom>
    </ShiftCell>
  );
}

const ShiftBar = styled.div`
  width: 4px;
  height: 100%;
  margin-right: 4px;
  border-radius: 2px 0 0 2px;
`;

const ShiftCell = styled.div`
  width: 14.2%;
  height: 100%;
  background-color: white;
  box-sizing: border-box;
  display: flex;
  justify-content: center;
  flex-direction: column;
  border-right: 1px solid ${colors.tableBorderGrey};
  border-bottom: 1px solid ${colors.tableBorderGrey};
`;

const ShiftTop = styled.div`
  letter-spacing: 0.75px;
  font-weight: 400;
  display: flex;
  height: 40%;
  margin: 2px 5px 4px 5px;
  flex-direction: row;
  justify-content: flex-end;

  &.notCurrentMonthtrue {
    color: ${colors.gray500};
  }
`;

const ShiftBottom = styled.div`
  height: 100%;
  min-height: 3vh;
  size: 4px;
  letter-spacing: 0.25px;
  font-weight: 800;
  display: flex;
  margin: 0 4px 4px 4px;
  justify-content: flex-start;
  flex-direction: row;
  border-radius: 2px;
`;

const ShiftSymbol = styled.p`
  margin: auto;
`;
