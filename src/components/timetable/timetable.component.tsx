/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import React from "react";
import { ScheduleComponentState } from "../schedule-page/table/schedule/schedule-state.model";
import { TimeTableSection } from "./timetable-section.component";
export interface TimeTableComponentOptions {
  scheduleLocalState: ScheduleComponentState;
}

export function TimeTableComponent(options: TimeTableComponentOptions): JSX.Element {
  return (
    <div>
      <TimeTableSection scheduleLocalState={options.scheduleLocalState} />
    </div>
  );
}
