/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import { alpha } from "@material-ui/core";
import React from "react";
import { useSelector } from "react-redux";
import * as S from "./worker-calendar-cell.styled";
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
    background = alpha(shiftColor, 0.4);
  } else {
    shiftColor = alpha("#FFFFFF", 0);
    background = alpha(shiftColor, 0);
  }
  return (
    <S.ShiftCell className={notCurrentMonth}>
      <S.ShiftTop className={notCurrentMonth}>{date.date}</S.ShiftTop>
      <S.ShiftBottom style={{ color: shiftColor, backgroundColor: background }}>
        <S.ShiftSymbol style={{ color: shiftColor }}>
          {params.keepOn ? void 0 : shiftCode}
        </S.ShiftSymbol>
      </S.ShiftBottom>
    </S.ShiftCell>
  );
}
