/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import React, { useContext } from "react";
import { TranslationHelper } from "../../../../../../helpers/translations.helper";
import { shifts } from "../../../../../../common-models/shift-info.model";
import { MdClose } from "react-icons/md";
import { ScheduleLogicContext } from "../../use-schedule-state";
import { Sections } from "../../../../../../logic/providers/schedule-provider.model";
import { ShiftsInfoLogic } from "../../../../../../logic/schedule-logic/shifts-info.logic";

export interface CellDetailsOptions {
  index: number;
  day: number;
  month: number;
  year: number;
  rowIndex: number;
  shiftcode: string;
  sectionKey: string;
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
  const { index, day, month, year, shiftcode, close, sectionKey, rowIndex } = props;
  const [displayedYear, monthName] = prepareYearAndMonth(index, day, month, year);
  const foundShift = shifts[shiftcode];

  const scheduleLogic = useContext(ScheduleLogicContext);
  const sKey: keyof Sections = sectionKey === "NurseInfo" ? "NurseInfo" : "BabysitterInfo";
  const workerShifts = scheduleLogic?.getSection<ShiftsInfoLogic>(sKey)?.workerShifts;
  const workers = Object.keys(workerShifts ? workerShifts : 0);
  const worker = workers[rowIndex];

  return (
    <div className="align-to-the-left">
      <div className="exit-button" onClick={close}>
        <MdClose />
      </div>
      <div className="cell-details-date">
        {day} {monthName} {displayedYear} r.
      </div>
      <div>{worker}</div>
      <div className="shift-time-container">
        <div className="shift-time-rectangle" style={{ backgroundColor: `#${foundShift.color}` }} />
        <div className="shift-time" style={{ backgroundColor: `#${foundShift.color}` }}>
          {foundShift.name}
        </div>
        <div className="black-letters">{foundShift.name}</div>
        <div className="shift-time-from-to">
          {foundShift.isWorkingShift ? `${foundShift.from}:00 - ${foundShift.to}:00` : ""}
        </div>
      </div>
    </div>
  );
}
