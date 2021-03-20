/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import React from "react";
import { TimeTableRow } from "./timetable-row.component";

export function TimeTableSection(): JSX.Element {
  return (
    <>
      <table className="table">
        <tbody>
          <TimeTableRow data-cy="timetable-row" />
        </tbody>
      </table>
    </>
  );
}
