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
  shift: string;
  sectionKey: string;
  close: () => void;
}

export function CellDetails(props: CellDetailsOptions): JSX.Element {
  const { index, day, month, year, shift, close, sectionKey, rowIndex } = props;
  let displayedYear = year;
  let monthName = `${TranslationHelper.polishMonthsGenetivus[month]}`;
  if (index < day) {
    if (month > 0) {
      monthName = `${TranslationHelper.polishMonthsGenetivus[month - 1]}`;
    } else {
      monthName = `${TranslationHelper.polishMonthsGenetivus[month + 11]}`;
      displayedYear = year - 1;
    }
  }
  const shiftcode = shift;
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
          {foundShift.isWorkingShift ? `${foundShift.from}:00 -` : ""}
          {foundShift.isWorkingShift ? ` ${foundShift.to}:00` : ""}
        </div>
      </div>
    </div>
  );
}
