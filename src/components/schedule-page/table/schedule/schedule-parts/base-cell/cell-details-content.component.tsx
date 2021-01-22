/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import React, { useRef } from "react";
import { TranslationHelper } from "../../../../../../helpers/translations.helper";
import { shifts } from "../../../../../../common-models/shift-info.model";
import { MdClose } from "react-icons/md";
import { useSelector } from "react-redux";
import { ApplicationStateModel } from "../../../../../../state/models/application-state.model";

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
  const closeRef = useRef<HTMLDivElement>(null);
  const state = useSelector((state: ApplicationStateModel) => state);
  const workers = Object.keys(state.actualState.persistentSchedule.present.shifts);
  const worker = workers[rowIndex];
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
  let shiftcode = shift;
  if (shiftcode === "") shiftcode = "W";
  const foundShift = shifts[shiftcode];

  return (
    <div className="align-to-the-left">
      <div ref={closeRef} className="exit-button" onClick={close}>
        <MdClose />
      </div>
      <div style={{ fontWeight: "lighter" }}>
        {day} {monthName} {displayedYear} r.
      </div>
      <div>
        {worker}, {sectionKey}
      </div>
      <div className="shift-time-container">
        <div className="shift-time-rectangle" style={{ backgroundColor: `#${foundShift.color}` }} />
        <div className="shift-time" style={{ backgroundColor: `#${foundShift.color}` }}>
          {foundShift.name}
        </div>
        <div className="shift-time-from-to">
          {foundShift.isWorkingShift ? `${foundShift.from}:00 -` : ""}
          {foundShift.isWorkingShift ? ` ${foundShift.to}:00` : ""}
        </div>
      </div>
    </div>
  );
}
