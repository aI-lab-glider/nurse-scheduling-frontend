/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import React from "react";
import { DataRow } from "../../logic/schedule-logic/data-row";
import { ScheduleComponentState } from "../schedule-page/table/schedule/schedule-state.model";
import { TimeTableRow } from "./timetable-row.component";

export interface TimeTableSectionOptions {
  scheduleLocalState: ScheduleComponentState;
}
export function TimeTableSection({ scheduleLocalState }: TimeTableSectionOptions): JSX.Element {
  function getDataRow(): DataRow {
    if (scheduleLocalState.isInitialized) {
      const d = scheduleLocalState.dateSection?.values().next().value as DataRow;
      if (!d.isEmpty) {
        return d;
      }
    }
    const today = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0);
    return new DataRow(
      "Dni miesiąca",
      Array.from({ length: today.getDate() }, (_, i) => i + 1)
    );
  }

  const data = getDataRow();

  return (
    <>
      <table className="table">
        <tbody>
          <TimeTableRow uuid={scheduleLocalState.uuid} dataRow={data} data-cy="timetable-row" />
        </tbody>
      </table>
    </>
  );
}
