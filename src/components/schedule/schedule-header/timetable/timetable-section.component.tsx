/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import React from "react";
import { TimeTableRow } from "./timetable-row.component";
import { SectionWrapper } from "../../base/styled";

export function TimeTableSection(): JSX.Element {
  // TODO: Remove this component too

  return (
    <SectionWrapper className="borderContainer">
      <TimeTableRow data-cy="timetable-row" />
    </SectionWrapper>
  );
}
