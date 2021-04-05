/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import React from "react";
import { VerboseDate } from "../../../state/models/common-models/month-info.model";
import { ShiftCode } from "../../../state/models/common-models/shift-info.model";
import { getColor } from "../../../components/schedule/worker-info-section/shifts-section/shift-cell.component";
import { fade } from "@material-ui/core";
import {
  bottomCellPartClassName,
  hasNextShiftClassName,
  keepOnShiftClassName,
} from "../../../components/schedule/base/base-cell/base-cell.models";
import { useSelector } from "react-redux";
import { ApplicationStateModel } from "../../../state/models/application-state.model";

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
  const date = params.date;
  const shift = params.shift;
  const keepOn = keepOnShiftClassName(params.keepOn);
  const hasNext = hasNextShiftClassName(params.hasNext);
  const notCurrentMonth = "notCurrentMonth" + params.notCurrentMonth;
  const workersCalendar =
    params.keepOn || params.hasNext ? "" : "_workersCalendar" + params.workersCalendar;
  let shiftColor, background;

  const { shift_types: shiftTypes } = useSelector(
    (state: ApplicationStateModel) => state.actualState.persistentSchedule.present
  );

  if (shift) {
    shiftColor = `#${getColor(shift, shiftTypes)}`;
    background = fade(shiftColor, 0.3);
  } else {
    shiftColor = fade("#FFFFFF", 0);
    background = fade(shiftColor, 0);
  }
  const isTop = params.isTop !== undefined ? " isTop" + params.isTop : "";
  const isLeft = params.isLeft !== undefined ? " isLeft" + params.isLeft : "";
  return (
    <>
      <div className={"workersCalendarCell" + isLeft + isTop}>
        <div className={"TopCellPart " + notCurrentMonth}>{date!["date"]}</div>
        <div
          className={`${bottomCellPartClassName()} ${keepOn}${workersCalendar}${shift} ${hasNext} ${keepOn}`}
          style={{ color: shiftColor, backgroundColor: background }}
        >
          <div className={"leftBorder leftBorderColor"} style={{ backgroundColor: shiftColor }} />
          <p>{params.keepOn ? void 0 : shift}</p>
        </div>
      </div>
    </>
  );
}
